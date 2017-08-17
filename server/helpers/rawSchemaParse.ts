import * as es from 'event-stream';

import BSONTypeHelper from './bsonTypeHelper';

let parse = function(){

  let rawSchemes = [];

  let buildRawSchema = function(value, key) {
    let extendedJSONType = BSONTypeHelper.getBSONType(value);
    let response;
    if(extendedJSONType){
      response = extendedJSONType;
    } else if(value == null){
      response = "Null";
    } else if (value == undefined){
      response = "Undefined";
    } else if (Array.isArray(value)){
      response = [];
      value.forEach((item) => {
        let rawSchema = buildRawSchema(item, null)
        let hasRawSchema = response.find((resp) => {
          return JSON.stringify(resp) === JSON.stringify(rawSchema);
        }) != null;
        if(!hasRawSchema)
          response.push(rawSchema);
      });
    } else if (typeof value === "object") {
      response = {};
      Object.keys(value).forEach((key) => {
        response[key] = buildRawSchema(value[key], key);
      });
    } else {
      response = value.constructor.name;
    }
    return response;
  };

  let mapper = es.through(function write(document) {
    let rawSchema = {};
    Object.keys(document).forEach((key) => {
      rawSchema[key] = buildRawSchema(document[key], key);
    });
    let docRawSchema = {
      "docId":document._id,
      "docRawSchema":JSON.stringify(rawSchema)
    }
    rawSchemes.push(docRawSchema);
    this.emit('progress', document);
  }, function end() {
    this.emit('data', rawSchemes);
    this.emit('end');
  });

  mapper.on('close', function() {
    this.destroy();
  });

  return mapper;

}

export default parse;