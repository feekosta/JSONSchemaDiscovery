class RawSchemaUnifierHashMap {
	rootSchema = {};
	union = (collection, callback) => {
		collection.forEach((item) => {
			this.addToField(null, JSON.parse(item.rawSchema), item.count);
		});
		callback(null, this.rootSchema);
	}
	addToField = (path, value, count) => {
		Object.keys(value).forEach((key) => {
		  	let absolutePath = path != null ? `${path}.${key}` : key;
			if(typeof value[key] === "string"){
				if(!this.rootSchema[absolutePath]){
		    		let field = {
		    			'path':absolutePath,
		    			'totalCount':Number(count),
		    			'types': [{
		    				'type':value[key],
		    				'count':Number(count)
		    			}]
		    		};
		    		this.rootSchema[absolutePath] = field; 
		    	} else {
		    		this.rootSchema[absolutePath].totalCount = Number(this.rootSchema[absolutePath].totalCount)+Number(count);
		    		let type = this.rootSchema[absolutePath].types.find((item) => { return item.type === value[key]; });
		    		if(!type){
		    			type = {
		    				'type':value[key],
		    				'count':Number(count)
		    			}
		    			this.rootSchema[absolutePath].types.push(type);
		    		} else {
		    			type.count = Number(type.count)+Number(count);
		    		}
		    	}
			} else if (Array.isArray(value[key])){
				value[key].forEach((val) =>{
					this.addToType(absolutePath, val, Number(count));
				})
			} else {
				this.addToField(absolutePath, value[key], Number(count));
		    }
		});
	}
	addToType = (path, value, count) => {
		if(typeof value === "string"){
			if(!this.rootSchema[path]){
				let val = {
	    			'path':path,
	    			'totalCount':Number(count),
	    			'types': [{
	    				'type':value,
	    				'count':Number(count)
	    			}]
	    		};
	    		this.rootSchema[path] = val; 
			} else {
				this.rootSchema[path].totalCount = Number(this.rootSchema[path].totalCount)+Number(count);
	    		let type = this.rootSchema[path].types.find((item) => { return item.type === value; });
	    		if(!type){
	    			type = {
	    				'type':value,
	    				'count':Number(count)
	    			}
	    			this.rootSchema[path].types.push(type);
	    		} else {
	    			type.count = Number(type.count)+Number(count);
	    		}
			}
		} else if (Array.isArray(value)){
			value.forEach((val) =>{
				this.addToType(path, val, Number(count));
			});
		} else {
			this.addToField(path, value, Number(count));
		}
	}
}
export default RawSchemaUnifierHashMap;