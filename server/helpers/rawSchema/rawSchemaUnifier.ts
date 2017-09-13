class RawSchemaUnifier {
	rootSchema = {
		fields: [],
		count: 0
	};
	union = (documents, callback) => {
		documents.forEach((document) => {
			this.buildRawSchema(JSON.parse(document.rawSchema), Number(document.count), this.rootSchema.fields, null);
			this.rootSchema.count = this.sum(this.rootSchema.count, document.count);
		});
		callback(null, this.rootSchema);
	};
	buildRawSchema = (document, count, fields, parent) => {
		Object.keys(document).forEach((key) => {
			const path = parent != null ? `${parent}.${key}` : key;
			this.addToField(path, document[key], fields, count);
		});
	};
	addToField = (path, value, fields, count) => {
		const lastPath = path.split('.').pop();
		let field = fields.find((field) => { 
			return field.path === path; 
		});
		field = this.getOrUpdateInstance(field, fields, lastPath, path, count);
		if(!field.types)
			field.types = [];
		this.addToType(path, value, field.types, count);
	};
	addToType = (path, value, types, count) => {
		const typeName = this.getTypeFromValue(value);
		let type = types.find((currentType) => { 
			return currentType.name === typeName; 
		});
		type = this.getOrUpdateInstance(type, types, typeName, path, count);
		this.workOnType(path, value, type, typeName, count);
	};
	addToItem = (path, value, items, count) => {
		const typeName = this.getTypeFromValue(value);
		let item = items.find((currentItem) => {
			return currentItem.name === typeName && currentItem.path === path;
		});
		item = this.getOrUpdateInstance(item, items, typeName, path, count);
		this.workOnType(path, value, item, typeName, count);
	}
	workOnType = (path, value, instance, typeName, count) => {
		if(typeName === 'Array'){
			if(!instance.items)
				instance.items = [];
			value.forEach((arrayItem) => {
				this.addToItem(path, arrayItem, instance.items, count);
			});
		} else if(typeName === 'Object'){
			if(!instance.fields)
				instance.fields = [];
			this.buildRawSchema(value, count, instance.fields, path);
		}
	}
	getTypeFromValue = (value) => {
		if(typeof value === "string"){
			return value;
		} else if (Array.isArray(value)){
			return "Array";
		} else {
			return "Object";
		}
	};
	sum = (value1, value2) => Number(value1) + Number(value2);
	getOrUpdateInstance = (instance, instances, name, path, count) => {
		if(!instance){
			instance = {
				"name":name,
				"path":path,
				"count":Number(count)
			};
			instances.push(instance);
		} else {
			instance.count = this.sum(instance.count, count);
		}
		return instance;
	}
}
export default RawSchemaUnifier;