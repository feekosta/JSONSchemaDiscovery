import {EventEmitter} 		from 'events';
import RawSchemaDiscoverer 	from './rawSchemaDiscoverer';
class RawSchemaProcessWorker extends EventEmitter {
	limit = 8000;
	work(rawSchemaBatch, collection, lastObjectId): EventEmitter {
		console.log("work in greater than ",lastObjectId);
		const start = new Date();
		const collectionToWork = collection.find(lastObjectId != null ? {'_id':{$gt:lastObjectId}} : {}).sort({_id:1}).limit(this.limit);
		const discovery = new RawSchemaDiscoverer().discovery(collectionToWork);
		discovery.on('end', (rawSchemes) => {
			this.emit('save',rawSchemes);
			if(rawSchemes.length > 0){
				this.emit('lastObjectId',rawSchemes[rawSchemes.length-1].docId);
			} else {
				this.emit('done');
			}
			console.log("end in ",Math.abs((start.getTime() - new Date().getTime())/1000));
		});
		discovery.on('error',(error) => { this.emit('error',error); });
		return this;
	}
}
export default RawSchemaProcessWorker;
