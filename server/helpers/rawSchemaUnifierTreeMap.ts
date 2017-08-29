class RawSchemaUnifier {
	rootSchema = {
		fields: [],
		count: 0
	};
	union = (documents, callback) => {
		documents.forEach((document) => {
			this.buildRawSchema(JSON.parse(document.rawSchema), Number(document.count), this.rootSchema.fields, null);
			this.rootSchema.count = Number(this.rootSchema.count) + Number(document.count);
		});
		callback(null, this.rootSchema);
	};
	buildRawSchema = (document, count, fields, parent) => {
		Object.keys(document).forEach((key) => {
			let path = parent != null ? `${parent}.${key}` : key;
			this.addToField(path, document[key], fields, count);
		});
	};
	addToField = (path, value, fields, count) => {
		let lastPath = path.split('.').pop();
		let field = fields.find((field) => { return field.path === path; });
		if(!field){
			field = {
				'name': lastPath,
				'path': path,
				'count': Number(count),
				'types': []
			}
			fields.push(field);
		} else {
			field.count = Number(field.count)+Number(count);
		}
		this.addToType(path, value, field.types, count);
	};
	addToType = (path, value, types, count) => {
		let typeName = this.getTypeFromValue(value);
		let type = types.find((currentType) => { return currentType.name === typeName; });
		if(!type) {
			type = {
				'name': typeName,
				'path': path,
				'count': Number(count)
			}
			types.push(type);
		} else {
			type.count = Number(type.count)+Number(count);
		}

		if(typeName === 'Array'){
			if(!type.types)
				type.types = [];
			value.forEach((arrayItem) => {
				const arrayItemTypeName = this.getTypeFromValue(arrayItem);
				const existingArrayItemType = type.types.find((currentType) => {
					return currentType.name === arrayItemTypeName && currentType.path === path;
				});
				const totalCount = existingArrayItemType != null ? Number(existingArrayItemType.count) + Number(count) : count;
				let arrayItemType = this.buildInstance(path, arrayItem, totalCount);
				if(!existingArrayItemType){
					type.types.push(arrayItemType);
				} else {
					existingArrayItemType.count = Number(existingArrayItemType.count) + Number(arrayItemType.count);
				}
			})
		} else if (typeName === 'Object'){
			if(!type.fields)
				type.fields = [];
			Object.keys(value).forEach((key) => {
				this.addToField(`${path}.${key}`, value[key], type.fields, count);
			});
		}
	};
	buildInstance = (path, value, count) => {
		let typeName = this.getTypeFromValue(value);
		let instance;
		if(typeName === 'Array'){
			instance = {
				'name': typeName,
				'path': path,
				'count': Number(count),
				'types': []
			}
			value.forEach((val) => {
				let type = this.buildInstance(path, val, count);
				let typeInArray = instance.types.find((currentType) => {
					return currentType.name === type.name && currentType.path === type.path;
				});
				if(!typeInArray){
					instance.types.push(type);
				} else {
					typeInArray.count = Number(typeInArray.count) + Number(type.count);
				}
			})
		} else if (typeName === 'Object'){
			instance = {
				'name': typeName,
				'path': path,
				'count': Number(count),
				'fields': []
			}
			this.buildRawSchema(value, count, instance.fields, path);
		} else {
			instance = {
				'name': typeName,
				'path': path,
				'count': Number(count)
			}
		}
		return instance;
	};
	getTypeFromValue = (value) => {
		if(typeof value === "string"){
			return value;
		} else if (Array.isArray(value)){
			return "Array";
		} else {
			return "Object";
		}
	};
}
export default RawSchemaUnifier;