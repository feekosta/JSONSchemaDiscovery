import JSONSchema from './jsonSchema';
class JsonSchemaBuilder {
	rootSchema = new JSONSchema();
	usedDefinitions = [];
	build = (fields, count, callback) => {
		this.rootSchema.properties = this.buildProperties(fields, count);

		this.rootSchema.required = [];
		Object.keys(this.rootSchema.properties).forEach((property) => {
			if(this.rootSchema.properties[property].count === count)
				this.rootSchema.required.push(property);
			delete this.rootSchema.properties[property].count;
		});

		this.removeUnusedDefinitions();
		callback(null, this.rootSchema);
	}
	buildProperties = (fields, count) => {
		const properties = {};
		fields.forEach((field) => {
			properties[field.name] = this.addToProperties(field, count);
		});
		return properties;
	}
	addToProperties = (value, count) => {
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
					instance = this.addToProperties(type, 0);
				} else {
					instance = this.addToProperties(type, 0);
					instance.name = type.path;
				}
			} else {
				instance = {
					"name": value.name,
					"anyOf": this.addToItems(value.types),
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
				instance = {
					"name": value.path,
					"type": value.name.toLowerCase(),
					"items": this.addToItems(value.items),
					"minItems":0,
					"count": value.count,
					"additionalItems":true
				}
				const totalCount = instance.items.map((item) => item.count).reduce((preVal, elem) => preVal + elem, 0);
				if(totalCount === value.count)
					instance.minItems = 1;
				instance.items.forEach((item) => {
					delete item.count;
				});
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
	addToItems = (values) => {
		const items = [];
		values.forEach((value) => {
			items.push(this.addToProperties(value, 0));
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