import * as es from 'event-stream';
import {EventEmitter} from 'events';
import rawSchemaParser from './rawSchemaParser';
class RawSchemaDiscovery extends EventEmitter {
	discovery(collection): EventEmitter {
		let result;
		const parser = collection.stream().pipe(rawSchemaParser());
		parser.on('data', (data) => { result = data; });
		parser.on('end', () => { this.emit('end',result); });
		parser.on('error',(error) => { this.emit('error',error); });
		return this;
	}
}
export default RawSchemaDiscovery;
