import * as es from 'event-stream';
import RawSchemaBuilder from './rawSchemaBuilder';
let parse = function(){
  let rawSchemes = [];
  let mapper = es.through(function write(document) {
    let rawSchema = {};
    Object.keys(document).forEach((key) => {
      rawSchema[key] = RawSchemaBuilder.build(document[key], key);
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