import {EventEmitter} 		from 'events';
import RawSchemaDiscoverer 	from './rawSchemaDiscoverer';
class RawSchemaProcessWorker extends EventEmitter {
	limit = 10000;
	work(rawSchemaBatch, collection, lastObjectId): EventEmitter {
		console.log("work in greater than ",lastObjectId);
		const start = new Date();
		const collectionToWork = collection.find(lastObjectId != null ? {'_id':{$gt:lastObjectId}} : {}).sort({_id:1}).limit(this.limit);
		const discovery = new RawSchemaDiscoverer().discovery(collectionToWork, rawSchemaBatch._id);
		discovery.on('end', (rawSchemes) => {
			console.log("end in ",Math.abs((start.getTime() - new Date().getTime())/1000));
			this.emit('save',rawSchemes);
			if(rawSchemes.length > 0){
				this.emit('lastObjectId',rawSchemes[rawSchemes.length-1].docId);
			} else {
				this.emit('done');
			}
		});
		discovery.on('error',(error) => { this.emit('error',error); });
		return this;
	}
}
export default RawSchemaProcessWorker;
