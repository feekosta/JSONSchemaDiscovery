import {EventEmitter} 		from 'events';
import RawSchemaDiscoverer 	from './rawSchemaDiscoverer';

import RawSchemaController from '../../controllers/rawSchema/rawSchema';

import {ObjectID} from 'mongodb';

export default class RawSchemaProcessWorker extends EventEmitter {
	
	limit = 1000;

	work = (collection, rawSchemaBatch): EventEmitter => {
		const saver = new RawSchemaController(rawSchemaBatch._id);
		let working = this.workNow(rawSchemaBatch, collection, null);
		let totalImported = 0;
		working.on('save', (data) => {
			saver.saveAll(data, rawSchemaBatch._id).then((data) => {
				totalImported += data.length;
				if(totalImported >= rawSchemaBatch.collectionCount){
					rawSchemaBatch.status = "REDUCE_DOCUMENTS";
					rawSchemaBatch.extractionDate = new Date();
					rawSchemaBatch.save().then((data) => {
						this.emit('finalized', rawSchemaBatch);
					});
				}
			});
		})
		.on('lastObjectId', (lastObjectId) => {
			console.log("work in greater than ",lastObjectId);
			working = this.workNow(rawSchemaBatch, collection, lastObjectId);
		})
		.on('done', () => {
			console.log("terminou a pesquisa, aguardando salvamento em pendencia");
		})
		.on('error', (error) => {
			this.emit('error', error);
		});
		return this;
	}

	workNow = (rawSchemaBatch, collection, lastObjectId): EventEmitter => {
		const collectionToWork = collection.find(lastObjectId != null ? {'_id':{$gt:lastObjectId}} : {}).sort({_id:1}).limit(this.limit);
		const discovery = new RawSchemaDiscoverer().discovery(collectionToWork, rawSchemaBatch._id);
		discovery.on('end', (rawSchemes) => {
			this.emit('save',rawSchemes);
			if(rawSchemes.length > 0){
				this.emit('lastObjectId',rawSchemes[rawSchemes.length-1].docId);
			} else {
				this.emit('done');
			}
		});
		discovery.on('error',(error) => { 
			this.emit('error',error); 
		});
		return this;
	}
}