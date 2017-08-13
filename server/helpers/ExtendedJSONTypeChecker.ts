abstract class ExtendedJSONTypeChecker {
	static isExtendedJSONType(data) {
		if(data != null && data != undefined){
			if(data._bsontype != null){
				return data._bsontype;
			} else if (data.constructor.name === "Date"){
				return data.constructor.name;
			} else if (data.constructor.name === "RegExp"){
				return data.constructor.name;
			}
		}
	}
}
export default ExtendedJSONTypeChecker;