import JSONSchema from './jsonSchema';
class JsonSchemaBuilder {
	rootSchema = new JSONSchema();
	usedDefinitions = [];
	build = (collection, callback) => {
		this.rootSchema.properties = this.buildProperties(collection);
		this.removeUnusedDefinitions();
		callback(null, this.rootSchema);
	}
	buildProperties = (collection) => {
		const properties = {};
		collection.forEach((item) => {
			properties[item.name] = this.addToProperties(item);
		});
		return properties;
	}
	addToProperties = (value) => {
		let instance;
		if(value.types){
			if(value.types.length === 1){
				const type = value.types[0];
				if(this.isBSON(type)){
					this.addToUsedDefinitions(type.name);
					instance = {"$ref": `#/definitions/${type.name}`};
				} else if(this.isPrimitive(type)){
					instance = {
						"name": value.name,
						"type": type.name.toLowerCase()
					}
				} else if(type.name === "Array"){
					instance = this.addToProperties(type);
				} else {
					instance = this.addToProperties(type);
					instance.name = type.path;
				}
			} else {
				instance = {
					"name": value.name,
					"anyOf": this.addToItems(value.types)
				}
			}
		} else {
			if(this.isBSON(value)){
				this.addToUsedDefinitions(value.name);
				instance = {"$ref": `#/definitions/${value.name}`};
			} else if(this.isPrimitive(value)){
				instance = {
					"type": value.name.toLowerCase()
				}
			} else if(value.name === "Array"){
				instance = {
					"name": value.path,
					"type": value.name.toLowerCase(),
					"items": this.addToItems(value.items)
				}
			} else {
				instance = {
					"type": "object",
					"properties": this.buildProperties(value.fields)
				}
			}
		}
		return instance;
	}
	addToItems = (values) => {
		const items = [];
		values.forEach((value) => {
			items.push(this.addToProperties(value));
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