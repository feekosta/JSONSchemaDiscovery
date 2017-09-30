import * as co                            from 'co';
import * as mongodb                       from 'mongodb';
import {MongoClient}                      from 'mongodb'
import RawSchemaBatch                     from '../../models/rawSchema/rawSchemaBatch';
import RawSchemaProcessWorker             from '../../helpers/rawSchema/rawSchemaProcessWorker';
import DatabaseParam                      from '../../params/databaseParam';
import BaseController                     from '../base';
import RawSchemaController                from './rawSchema';
import RawSchemaOrderedResultController   from './rawSchemaOrderedResult';
import RawSchemaUnorderedResultController from './rawSchemaUnorderedResult';

export default class RawSchemaBatchController extends BaseController {
  
  model = RawSchemaBatch;

  discovery = (params): Promise<any> => {
    return new Promise((resolv, reject) => {
      const databaseParam = new DatabaseParam(JSON.parse(JSON.stringify(params)));
      const rawSchemaBatch = new this.model();
      rawSchemaBatch.collectionName = databaseParam.collectionName;
      rawSchemaBatch.dbUri = databaseParam.getURIWithoutAuthentication();
      rawSchemaBatch.userId = databaseParam.userId;
      rawSchemaBatch.startDate = new Date();
      this.getDatabaseConnection(databaseParam, (connectionError, database) => {
        if(connectionError)
          return reject({"message":connectionError, "code":404});
        resolv(rawSchemaBatch);

        const collection = database.collection(databaseParam.collectionName);
        this.setCollectionSize(collection, rawSchemaBatch);
        const worker = new RawSchemaProcessWorker();
        const saver = new RawSchemaController();
        worker.work(rawSchemaBatch, collection, null)
          .on('done',() => {
            rawSchemaBatch.status = "REDUCE_DOCUMENTS";
            rawSchemaBatch.extractionDate = new Date();
            console.log("BATCHQUERY",rawSchemaBatch._id," DONE IN: ",rawSchemaBatch.elapsedTime);
            rawSchemaBatch.save();
          })
          .on('error', (error) => {
            rawSchemaBatch.status = "ERROR";
            rawSchemaBatch.statusMessage = error;
            console.log("BATCHQUERY",rawSchemaBatch._id," ERROR: ",error);
            rawSchemaBatch.save();
          })
          .on('lastObjectId', (lastObjectId) => {
            worker.work(rawSchemaBatch, collection, lastObjectId);
          })
          .on('save', (rawSchemes) => {
            saver.saveAll(rawSchemes, rawSchemaBatch._id);
          });
      });
    });
  }

  getDatabaseConnection = (databaseParam, callback) => {
    return co(function*() {
      const url = databaseParam.getURI();
      const database = yield MongoClient.connect(url);
      return database;
    }).then((resp) => {
      return callback(null, resp);
    }).catch((err) => {
      return callback(err, null);
    });
  }

  setCollectionSize = (collection, rawSchemaBatch) => {
    return co(function*() {
      const count = yield collection.count();
      return count;
    }).then((resp) => {
      rawSchemaBatch.collectionCount = resp;
      rawSchemaBatch.status = "LOADING_DOCUMENTS";
      rawSchemaBatch.save();
    }).catch((err) => {});
  }

  mapReduce = (batchId): Promise<any> => {
    return new Promise((resolv, reject) => {
      let rawSchemaBatch;
      this.getById(batchId).then((rawSchemaBatchResult) => {
        if (!rawSchemaBatchResult)
          return reject({"message":`rawSchemaBatch with id: ${batchId} not found`, "code":404});
        return rawSchemaBatchResult;
      }).then((data) => {
        rawSchemaBatch = data;
        rawSchemaBatch.reduceType = "MAP_REDUCE";
        rawSchemaBatch.unorderedMapReduceDate = null;
        rawSchemaBatch.orderedMapReduceDate = null;
        rawSchemaBatch.unorderedAggregationDate = null;
        rawSchemaBatch.orderedAggregationDate = null;
        return new RawSchemaController().mapReduce(batchId);
      }).then((data) => {
        return  new RawSchemaUnorderedResultController(batchId).saveResults(data, batchId);
      }).then((data) => {
        rawSchemaBatch.unorderedMapReduceDate = new Date();
        rawSchemaBatch.save();
        return new RawSchemaUnorderedResultController(batchId).mapReduce(batchId);
      }).then((data) => {
        return new RawSchemaOrderedResultController().saveResults(data, batchId);
      }).then((data) => {
        rawSchemaBatch.orderedMapReduceDate = new Date();
        rawSchemaBatch.save();
        return resolv(data);
      }).catch((error) => {
        return reject({"message":error, "code":400});
      });
    });
  }

  aggregate = (batchId): Promise<any> => {
    return new Promise((resolv, reject) => {
      let rawSchemaBatch;
      this.getById(batchId).then((rawSchemaBatchResult) => {
        if (!rawSchemaBatchResult)
          return reject({"message":`rawSchemaBatch with id: ${batchId} not found`, "code":404});
        return rawSchemaBatchResult;
      }).then((data) => {
        rawSchemaBatch = data;
        rawSchemaBatch.reduceType = "AGGREGATE";
        rawSchemaBatch.unorderedMapReduceDate = null;
        rawSchemaBatch.orderedMapReduceDate = null;
        rawSchemaBatch.unorderedAggregationDate = null;
        rawSchemaBatch.orderedAggregationDate = null;
        return new RawSchemaController().aggregate(batchId);
      }).then((data) => {
        rawSchemaBatch.unorderedAggregationDate = new Date();
        rawSchemaBatch.save();
        return new RawSchemaUnorderedResultController(batchId).aggregate(batchId);
      }).then((data) => {
        return new RawSchemaOrderedResultController().saveResults(data, batchId);
      }).then((data) => {
        rawSchemaBatch.orderedAggregationDate = new Date();
        rawSchemaBatch.save();
        return resolv(data);
      }).catch((error) => {
        return reject({"message":error, "code":400});
      });
    });
  }

  aggregateAndReduce = (batchId): Promise<any> => {
    return new Promise((resolv, reject) => {
      let rawSchemaBatch;
      this.getById(batchId).then((rawSchemaBatchResult) => {
        if (!rawSchemaBatchResult)
          return reject({"message":`rawSchemaBatch with id: ${batchId} not found`, "code":404});
        return rawSchemaBatchResult;
      }).then((data) => {
        rawSchemaBatch = data;
        rawSchemaBatch.reduceType = "AGGREGATE_AND_MAP_REDUCE";
        rawSchemaBatch.unorderedMapReduceDate = null;
        rawSchemaBatch.orderedMapReduceDate = null;
        rawSchemaBatch.unorderedAggregationDate = null;
        rawSchemaBatch.orderedAggregationDate = null;
        return new RawSchemaController().aggregate(batchId);
      }).then((data) => {
        rawSchemaBatch.unorderedAggregationDate = new Date();
        rawSchemaBatch.save();
        return new RawSchemaUnorderedResultController(batchId).mapReduce(batchId);
      }).then((data) => {
        return new RawSchemaOrderedResultController().saveResults(data, batchId);
      }).then((data) => {
        rawSchemaBatch.orderedMapReduceDate = new Date();
        rawSchemaBatch.save();
        return resolv(data);
      }).catch((error) => {
        return reject({"message":error, "code":400});
      });
    });
  }

  getById = (id) => {
  	return this.model.findById(id);
  }

}
