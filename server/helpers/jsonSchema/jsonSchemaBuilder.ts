import JSONSchema from './jsonSchema';
class JsonSchemaBuilder {
	rootSchema = new JSONSchema();
	build = (collection, callback) => {
		this.rootSchema.properties = this.buildProperties(collection);
		callback(null, this.rootSchema);
	}
	buildProperties = (collection) => {
		let properties = {};
		collection.forEach((item) => {
			properties[item.name] = this.addToProperties(item);
		});
		return properties;
	}
	addToProperties = (value) => {
		let instance;
		if(value.types){
			if(value.types.length === 1){
				let type = value.types[0];
				if(this.isBSON(type)){
					instance = {"$ref": `#/definitions/${type.name}`};
				} else {
					if(this.isPrimitive(type)){
						instance = {
							"name":value.name,
							"type": type.name.toLowerCase()
						}
					} else {
						if(type.name === "Array"){
							instance = {
								"name":value.name,
								"type": "array",
								"items": this.addToProperties(type)
							}
						} else {
							instance = {
								"name":value.name,
								"type": "object",
								"properties": this.buildProperties(type.fields)
							}
						}
					}
				}
			} else {
				let items = []
				value.types.forEach((type) => {
					items.push(this.addToProperties(type));
				});
				return items;
			}
		} else {
			if(this.isBSON(value)){
				instance = {"$ref": `#/definitions/${value.name}`};
			} else {
				if(this.isPrimitive(value)){
					instance = {
						"type": value.name.toLowerCase()
					}
				} else {
					if(value.name === "Array"){
						instance = {
							"type": "array",
							"items": this.addToProperties(value)
						}
					} else {
						instance = {
							"type": "object",
							"properties": this.buildProperties(value.fields)
						}
					}
				}
			}
		}
		return instance;
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
}
export default JsonSchemaBuilder;