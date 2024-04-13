import {EventEmitter} from 'events';
import RawSchemaDiscoverer from './rawSchemaDiscoverer';
import RawSchemaController from '../../controllers/rawSchema/rawSchema';
import RawSchemaReader from './rawSchemaReader';

export default class RawSchemaProcessWorker extends EventEmitter {

  limit = 5000;
  totalImported = 0;

  work = (collection, rawSchemaBatch): EventEmitter => {
    const saver = new RawSchemaController(rawSchemaBatch._id);
    let working = this.workNow(rawSchemaBatch, collection, null);
    working.on('save', data => {
      saver.saveAll(data, rawSchemaBatch._id)
        .then(imported => {
          this.totalImported += imported.length;
          if (this.totalImported >= rawSchemaBatch.collectionCount) {
            rawSchemaBatch.status = 'REDUCE_DOCUMENTS';
            rawSchemaBatch.extractionDate = new Date();
            rawSchemaBatch.save().then(() => this.emit('finalized', rawSchemaBatch));
          }
        }).catch(error => this.emit('error', error));
    })
      .on('lastObjectId', lastObjectId => working = this.workNow(rawSchemaBatch, collection, lastObjectId))
      .on('error', error => this.emit('error', error));
    return this;
  };

  workNow = (rawSchemaBatch, collection, lastObjectId): EventEmitter => {
    const collectionToWork = collection.find(this.findBy(lastObjectId)).sort({_id: 1}).limit(this.limit);
    let discovery;
    if (rawSchemaBatch.rawSchemaFormat) {
      discovery = new RawSchemaReader().read(collectionToWork, rawSchemaBatch._id);
    } else {
      discovery = new RawSchemaDiscoverer().discovery(collectionToWork, rawSchemaBatch._id);
    }
    discovery.on('end', rawSchemes => {
      if (rawSchemes.length > 0) {
        this.emit('save', rawSchemes);
        this.emit('lastObjectId', rawSchemes[rawSchemes.length - 1].docId);
      } else {
        this.emit('done');
      }
    });
    discovery.on('error', error => this.emit('error', error));
    return this;
  };

  private findBy(lastObjectId) {
    return lastObjectId != null ? {'_id': {$gt: lastObjectId}} : {};
  }
}
