import {EventEmitter} from 'events';
import RawSchemaDiscovery from './rawSchemaDiscovery';
import RawSchemaController from '../controllers/rawSchema';
class RawSchemaProcessWorker extends EventEmitter {
	limit = 5000;
	work(rawSchemaBatch, collection, lastObjectId): EventEmitter {
		console.log("work in greater than ",lastObjectId);
		const start = new Date();
		const collectionToWork = collection.find(lastObjectId != null ? {'_id':{$gt:lastObjectId}} : {}).sort({_id:1}).limit(this.limit);
		const discovery = new RawSchemaDiscovery().discovery(collectionToWork);
		discovery.on('end', (rawSchemes) => {
			let lastObjectId = null;
			if(rawSchemes.length > 0)
				lastObjectId = rawSchemes[rawSchemes.length-1].docId;
			if(lastObjectId){
				this.emit('lastObjectId',lastObjectId);
			} else {
				this.emit('done');
			}
			new RawSchemaController().saveAll(rawSchemes, rawSchemaBatch._id, (saveAllError) => {});
			console.log("end in ",Math.abs((start.getTime() - new Date().getTime())/1000));
		});
		discovery.on('error',(error) => { this.emit('error',error); });
		return this;
	}
}
export default RawSchemaProcessWorker;
