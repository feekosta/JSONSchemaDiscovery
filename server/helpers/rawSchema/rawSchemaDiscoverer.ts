import {EventEmitter} from 'events';
import rawSchemaParser from './rawSchemaParser';

export default class RawSchemaDiscoverer extends EventEmitter {

  discovery(collection, batchId): EventEmitter {
    let result;
    const parser = collection.stream().pipe(rawSchemaParser(batchId));
    parser.on('data', data => result = data);
    parser.on('end', () => this.emit('end', result));
    parser.on('error', error => this.emit('error', error));
    return this;
  }

}
