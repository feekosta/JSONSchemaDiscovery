import BSONTypeHelper from './bsonTypeHelper';
abstract class RawSchemaBuilder {
  static build = (value, key) => {
    let BSONType = BSONTypeHelper.getBSONType(value);
    let response;
    if(BSONType){
      response = BSONType;
    } else if (value === undefined){
      response = "Undefined";
    } else if(value === null){
      response = "Null";
    } else if (Array.isArray(value)){
      response = [];
      value.forEach((val) => {
        let rawSchema = RawSchemaBuilder.build(val, null)
        let hasRawSchema = response.find((resp) => {
          return JSON.stringify(resp) === JSON.stringify(rawSchema);
        }) != null;
        if(!hasRawSchema)
          response.push(rawSchema);
      });
    } else if (typeof value === "object") {
      response = {};
      Object.keys(value).forEach((key) => {
        response[key] = RawSchemaBuilder.build(value[key], key);
      });
    } else {
      response = value.constructor.name;
    }
    return response;
  };
}
export default RawSchemaBuilder;