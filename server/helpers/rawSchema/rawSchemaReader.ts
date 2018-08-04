import {EventEmitter} from 'events';
import * as es from 'event-stream';

export default class RawSchemaReader extends EventEmitter {

  read(collection, batchId): EventEmitter {
    let result;
    const parser = collection.stream().pipe(reader(batchId));
    parser.on('data', data => result = data);
    parser.on('end', () => this.emit('end', result));
    parser.on('error', error => this.emit('error', error));
    return this;
  }

}

const reader = function(batchId: string) {
  const rawSchemes = [];
  const mapper = es.through(function write(document) {
    rawSchemes.push({
      'docId': document._id,
      'docRawSchema': JSON.stringify(document.rawSchema),
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
