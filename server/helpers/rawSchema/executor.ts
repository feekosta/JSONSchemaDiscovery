import {EventEmitter} from 'events';
import {ObjectID} from 'mongodb';
import RawSchemaProcessWorker from './rawSchemaProcessWorker';

class Executor {

	execute = (collection, rawSchemaBatch): Promise<any> => {
	    return new Promise((resolv, reject) => {
			const work = new RawSchemaProcessWorker().work(collection, rawSchemaBatch);
	        work.on('finalized', (data) => {
	        	return resolv(data);
	        });
	        work.on('error', (error) => {
				return reject({"type":"LOADING_DOCUMENTS_ERROR", "message": error.message, "code":400});
	        });
	    });
	}

}
export default Executor;
