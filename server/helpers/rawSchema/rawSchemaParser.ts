import * as es          from 'event-stream';
import RawSchemaBuilder from './rawSchemaBuilder';
let parse = function(){
  const rawSchemes = [];
  const mapper = es.through(function write(document) {
    const documentRawSchema = {};
    Object.keys(document).forEach((key) => { 
      documentRawSchema[key] = RawSchemaBuilder.build(document[key]); 
    });
    rawSchemes.push({ 
      "docId":document._id, 
      "docRawSchema":JSON.stringify(documentRawSchema) 
    });
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