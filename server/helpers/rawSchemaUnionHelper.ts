export default class RawSchemaUnionHelper {
  
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
		    			'count':1,
		    			'types': [ object[key] ]
		    		};
		    		this.response[absolutePath] = obj; 
		    	} else {
		    		this.response[absolutePath].count = this.response[absolutePath].count+1;
		    		if(this.response[absolutePath].types.indexOf(object[key]) < 0)
		    			this.response[absolutePath].types.push(object[key]);
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
	    			'count':1,
	    			'types': [ object ]
	    		};
	    		this.response[absolutePath] = val; 
			} else {
				this.response[absolutePath].count = this.response[absolutePath].count+1;
	    		if(this.response[absolutePath].types.indexOf(object) < 0)
	    			this.response[absolutePath].types.push(object);
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
