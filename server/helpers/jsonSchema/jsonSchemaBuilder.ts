import JSONSchema from './jsonSchema';
class JsonSchemaBuilder {
	rootSchema = new JSONSchema();
	usedDefinitions = [];
	build = (fields, count) => {
		this.rootSchema.properties = this.getFieldsTypeSchema(fields, count);
		this.rootSchema.required = [];
		Object.keys(this.rootSchema.properties).forEach((property) => {
			if(this.rootSchema.properties[property].count === count)
				this.rootSchema.required.push(property);
			delete this.rootSchema.properties[property].count;
		});
		this.removeUnusedDefinitions();
		return this.rootSchema;
	}
	private getFieldsTypeSchema = (fields, count) => {
		const properties = {};
		fields.forEach((field) => {
			properties[field.name] = this.getSchemaFromValue(field, count);
		});
		return properties;
	}
	private getSchemaFromValue = (value, count) => {
		let instance;
		if(value.types){
			if(value.types.length === 1){
				const type = value.types[0];
				if(this.isBSON(type)){
					instance = this.getExtendedTypeSchema(type);
				} else if(this.isPrimitive(type)){
					instance = this.getPrimitiveTypeSchema(value.name, type.name, value.count);
				} else if(type.name === "Array"){
					instance = this.getSchemaFromValue(type, 0);
				} else {
					instance = this.getSchemaFromValue(type, 0);
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
				instance = this.getExtendedTypeSchema(value);
			} else if(this.isPrimitive(value)){
				instance = this.getPrimitiveTypeSchema(null, value.name, value.count);
			} else if(value.name === "Array"){
				instance = this.getArrayTypeSchema(value);
			} else {
				instance = this.getObjectTypeSchema(value);
			}
		}
		return instance;
	}
	private getExtendedTypeSchema = (type) => {
		this.addToUsedDefinitions(type.name);
		const schema = {
			"$ref": `#/definitions/${type.name}`,
			"count": type.count
		};
		return schema;
	}
	private getPrimitiveTypeSchema = (name, type, count) => {
		const schema = {
			"type": type.toLowerCase(),
			"count": count
		}
		if(name)
			schema.name = name;
		return schema;
	}
	private getObjectTypeSchema = (object) => {
		const schema = {
			"type": "object",
			"properties": this.getFieldsTypeSchema(object.fields, object.count),
			"count": object.count,
			"additionalProperties": false,
			"required":[]
		}
		Object.keys(schema.properties).forEach((property) => {
			if(schema.properties[property].count === object.count){
				schema.required.push(property);
			}
			delete schema.properties[property].count;
		});
		return schema;
	}
	private getArrayTypeSchema = (array) => {
		let items, totalCount;
		const itemsArray = this.buildItems(array.items);
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
		const schema = {
			"name": array.path,
			"type": array.name.toLowerCase(),
			"items": items,
			"minItems":0,
			"count": array.count,
			"additionalItems":true
		}
		if(totalCount === array.count)
			schema.minItems = 1;
		return schema;
	}
	private buildItems = (values) => {
		const items = [];
		values.forEach((value) => {
			items.push(this.getSchemaFromValue(value, 0));
		});
		return items;
	}
	private addToUsedDefinitions = (bsonType) => {
		if (this.usedDefinitions.indexOf(bsonType) < 0)
			this.usedDefinitions.push(bsonType);
	}
	private isBSON = (value) => {
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
	}
	private isPrimitive = (value) => {
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
	}
	private removeUnusedDefinitions = () => {
		Object.keys(this.rootSchema.definitions).forEach((definition) => {
			const definitionUsed = this.usedDefinitions.find((bsonType) => {
				return bsonType === definition;
			}) != null;
			if(!definitionUsed)
				delete this.rootSchema.definitions[definition];
		});
	}
}
export default JsonSchemaBuilder;