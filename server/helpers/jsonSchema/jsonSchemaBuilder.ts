import JSONSchema from './jsonSchema';
class JsonSchemaBuilder {
	rootSchema = new JSONSchema();
	usedDefinitions = [];
	build = (fields, count) => {
		this.rootSchema.properties = this.buildProperties(fields, count);
		this.rootSchema.required = [];
		Object.keys(this.rootSchema.properties).forEach((property) => {
			if(this.rootSchema.properties[property].count === count)
				this.rootSchema.required.push(property);
			delete this.rootSchema.properties[property].count;
		});
		this.removeUnusedDefinitions();
		return this.rootSchema;
	}
	buildProperties = (fields, count) => {
		const properties = {};
		fields.forEach((field) => {
			properties[field.name] = this.buildInstance(field, count);
		});
		return properties;
	}
	buildInstance = (value, count) => {
		let instance;
		if(value.types){
			if(value.types.length === 1){
				const type = value.types[0];
				if(this.isBSON(type)){
					this.addToUsedDefinitions(type.name);
					instance = {
						"$ref": `#/definitions/${type.name}`,
						"count": type.count
					};
				} else if(this.isPrimitive(type)){
					instance = {
						"name": value.name,
						"type": type.name.toLowerCase(),
						"count": value.count
					}
				} else if(type.name === "Array"){
					instance = this.buildInstance(type, 0);
				} else {
					instance = this.buildInstance(type, 0);
					instance.name = type.path;
				}
			} else {
				instance = {
					"name": value.name,
					"anyOf": this.buildItems(value.types),
					"count": value.count
				}
				instance.anyOf.forEach((item) => {
					delete item.count;
				});
			}
		} else {
			if(this.isBSON(value)){
				this.addToUsedDefinitions(value.name);
				instance = {"$ref": `#/definitions/${value.name}`};
			} else if(this.isPrimitive(value)){
				instance = {
					"type": value.name.toLowerCase(),
					"count": value.count
				}
			} else if(value.name === "Array"){
				let items, totalCount;
				const itemsArray = this.buildItems(value.items);
				if(itemsArray.length === 1){
					items = itemsArray.pop();
					totalCount = items.count;
					delete items.count;
				} else {
					items = {
						"anyOf": itemsArray
					}
					totalCount = itemsArray.map((item) => item.count).reduce((preVal, elem) => preVal + elem, 0);
					itemsArray.forEach((item) => {
						delete item.count;
					});
				}
				instance = {
					"name": value.path,
					"type": value.name.toLowerCase(),
					"items": items,
					"minItems":0,
					"count": value.count,
					"additionalItems":true
				}
				if(totalCount === value.count)
					instance.minItems = 1;
			} else {
				instance = {
					"type": "object",
					"properties": this.buildProperties(value.fields, value.count),
					"count": value.count,
					"additionalProperties": false,
					"required":[]
				}
				Object.keys(instance.properties).forEach((property) => {
					if(instance.properties[property].count === value.count){
						instance.required.push(property);
					}
					delete instance.properties[property].count;
				});
			}
		}
		return instance;
	}
	buildItems = (values) => {
		const items = [];
		values.forEach((value) => {
			items.push(this.buildInstance(value, 0));
		});
		return items;
	};
	addToUsedDefinitions = (bsonType) => {
		if (this.usedDefinitions.indexOf(bsonType) < 0)
			this.usedDefinitions.push(bsonType);
	}
	isBSON = (value) => {
		switch(value.name){
			case "Boolean":
			case "Null":
			case "String":
			case "Number":
			case "Array": 
			case "Object":
			case "Integer":
				return false;
			default:
				return true;
		}
	};
	isPrimitive = (value) => {
		switch(value.name){
			case "Boolean":
			case "Null":
			case "String":
			case "Number":
			case "Integer":
				return true;
			default:
				return false;
		}
	};
	removeUnusedDefinitions = () => {
		Object.keys(this.rootSchema.definitions).forEach((definition) => {
			const definitionUsed = this.usedDefinitions.find((bsonType) => {
				return bsonType === definition;
			}) != null;
			if(!definitionUsed)
				delete this.rootSchema.definitions[definition];
		});
	};
}
export default JsonSchemaBuilder;