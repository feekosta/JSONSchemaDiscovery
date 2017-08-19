class RawSchemaUnifier {
	rootSchema = {
		fields: [],
		count: 0
	};
	union = (collection, callback) => {
		collection.forEach((item) => {
			this.buildRawSchema(JSON.parse(item.rawSchema), Number(item.count));
			this.rootSchema.count = Number(this.rootSchema.count) + Number(item.count);
		});
		callback(null, this.rootSchema);
	};
	buildRawSchema = (object, count) => {
		Object.keys(object).forEach((key) => {
			this.addToField(key, object[key], this.rootSchema.fields, count);
		});
	};
	addToField = (path, value, fields, count) => {
		let lastPath = path.split('.').pop();
		let field = fields.find((field) => { return field.path === path});
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
		let typeName;
		if(typeof value === "string"){
			typeName = value;
		} else if (Array.isArray(value)){
			typeName = "Array";
		} else {
			typeName = "Object";
		}
		let type = types.find((type) => { return type.name === typeName});
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
			value.forEach((val) => {
				this.addToType(path, val, type.types, count);
			})
		} else if (typeName === 'Object'){
			if(!type.fields)
				type.fields = [];
			Object.keys(value).forEach((key) => {
				this.addToField(`${path}.${key}`, value[key], type.fields, count);
			});
		}
	};
}
export default RawSchemaUnifier;