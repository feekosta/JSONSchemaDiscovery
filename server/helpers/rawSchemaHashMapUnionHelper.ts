export default class RawSchemaHashMapUnionHelper {
  
	response = {};

	union = (collection, callback) => {
		collection.forEach((item) => {
			this.workOnKey(JSON.parse(item.rawSchema), null);
		});
		callback(null, this.response);
	}

	workOnKey = (object, path) => {
		Object.keys(object).forEach((key) => {
		  	let absolutePath = path != null ? path+"."+key : key;
			if(typeof object[key] === "string"){
				if(!this.response[absolutePath]){
		    		let obj = {
		    			'path':absolutePath,
		    			'totalCount':1,
		    			'types': [{
		    				'type':object[key],
		    				'count':1
		    			}]
		    		};
		    		this.response[absolutePath] = obj; 
		    	} else {
		    		this.response[absolutePath].totalCount = this.response[absolutePath].totalCount+1;
		    		let type = this.response[absolutePath].types.find((item) => {
		    			return item.type === object[key];
		    		});
		    		if(type){
		    			type.count = type.count+1;
		    		} else {
		    			this.response[absolutePath].types.push({'type':object[key],'count':1});
		    		}
		    	}
			} else if (Array.isArray(object[key])){
				object[key].forEach((current) =>{
					this.workOnValue(current, absolutePath);
				})
			} else {
				this.workOnKey(object[key], absolutePath);
		    }

		});
	}

	workOnValue = (object, absolutePath) => {
		if(typeof object === "string"){
			if(!this.response[absolutePath]){
				let val = {
	    			'path':absolutePath,
	    			'totalCount':1,
	    			'types': [{
	    				'type':object,
	    				'count':1
	    			}]
	    		};
	    		this.response[absolutePath] = val; 
			} else {
				this.response[absolutePath].totalCount = this.response[absolutePath].totalCount+1;
	    		let type = this.response[absolutePath].types.find((item) => {
	    			return item.type === object;
	    		});
	    		if(type){
	    			type.count = type.count+1;
	    		} else {
	    			this.response[absolutePath].types.push({'type':object,'count':1});
	    		}
			}
		} else if (Array.isArray(object)){
			object.forEach((current) =>{
				this.workOnValue(current, absolutePath);
			});
		} else {
			this.workOnKey(object, absolutePath);
		}
	}

}
