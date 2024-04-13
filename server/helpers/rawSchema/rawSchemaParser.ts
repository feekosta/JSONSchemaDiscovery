import * as es from 'event-stream';
import RawSchemaBuilder from './rawSchemaBuilder';

const parse = function (batchId: string) {
  const rawSchemes = [];
  const mapper = es.through(function write(document) {
    const documentRawSchema = {};
    Object.keys(document).forEach(key => {
      documentRawSchema[key] = RawSchemaBuilder.build(document[key]);
    });
    rawSchemes.push({
      'docId': document._id,
      'docRawSchema': JSON.stringify(documentRawSchema),
      'batchId': batchId
    });
    this.emit('progress', document);
  }, function end() {
    this.emit('data', rawSchemes);
    this.emit('end');
  });
  // mapper.on('close', () => this.destroy());
  return mapper;
};

export default parse;
