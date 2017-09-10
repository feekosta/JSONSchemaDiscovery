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

  discovery = (req, res) => {
    const databaseParam = new DatabaseParam(JSON.parse(JSON.stringify(req.body)));
    const rawSchemaBatch = new this.model();
    rawSchemaBatch.collectionName = databaseParam.collectionName;
    rawSchemaBatch.dbUri = databaseParam.getURIWithoutAuthentication();
    rawSchemaBatch.userId = databaseParam.userId;
    rawSchemaBatch.startDate = new Date();
    this.getDatabaseConnection(res, databaseParam, (connectionError, database) => {
      if(connectionError){ return this.error(res, connectionError, 400)};
      this.success(res, rawSchemaBatch._id);
      const collection = database.collection(databaseParam.collectionName);
      this.setCollectionSize(res, collection, rawSchemaBatch);
      const worker = new RawSchemaProcessWorker();
      const saver = new RawSchemaController();
      worker.work(rawSchemaBatch, collection, null)
        .on('done',() => {
          rawSchemaBatch.status = "DONE";
          rawSchemaBatch.endDate = new Date();
          rawSchemaBatch.elapsedTime = Math.abs((rawSchemaBatch.startDate.getTime() - rawSchemaBatch.endDate.getTime())/1000);
          console.log("BATCHQUERY",rawSchemaBatch._id," DONE IN: ",rawSchemaBatch.elapsedTime);
          this.save(rawSchemaBatch, (rawSchemaBatchSaveError, rawSchemaBatchSaved) => {});
        })
        .on('error', (error) => {
          rawSchemaBatch.status = "ERROR";
          rawSchemaBatch.statusMessage = error;
          console.log("BATCHQUERY",rawSchemaBatch._id," ERROR: ",error);
          this.save(rawSchemaBatch, (rawSchemaBatchSaveError, rawSchemaBatchSaved) => {});
        })
        .on('lastObjectId', (lastObjectId) => {
          worker.work(rawSchemaBatch, collection, lastObjectId);
        })
        .on('save', (rawSchemes) => {
          saver.saveAll(rawSchemes, rawSchemaBatch._id, (saveAllError) => {});
        });
    });
  }

  getDatabaseConnection = (res, databaseParam, callback) => {
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

  setCollectionSize = (res, collection, rawSchemaBatch) => {
    return co(function*() {
      const count = yield collection.count();
      return count;
    }).then((resp) => {
      rawSchemaBatch.collectionCount = resp;
      rawSchemaBatch.status = "IN_PROGRESS";
      this.save(rawSchemaBatch, (rawSchemaBatchSaveError, rawSchemaBatchResult) => {});
    }).catch((err) => {});
  }

  reduce = (req, res) => {
    this.getById(req.body.batchId, (rawSchemaBatchError, rawSchemaBatchResult) => {
      if (rawSchemaBatchError) { return this.error(res, rawSchemaBatchError, 500); }
      if (!rawSchemaBatchResult) { return this.error(res, `rawSchemaBatch with id: ${req.body.batchId} not found`, 404); }

      const start = new Date();
      new RawSchemaController().mapReduce(rawSchemaBatchResult._id, (mapReduceError, mapReduceResult) => {
        if (mapReduceError) { return this.error(res, mapReduceError, 500); }
        const mapreduce = new Date();
        console.log("mapreduce end in ",Math.abs((start.getTime() - mapreduce.getTime())/1000));
        
        new RawSchemaUnorderedResultController(rawSchemaBatchResult._id).saveResults(mapReduceResult, rawSchemaBatchResult._id, (saveResultsError) => {
          if (saveResultsError) { return this.error(res, saveResultsError, 500); }
          const save = new Date();
          console.log("save mapreduce end in ",Math.abs((mapreduce.getTime() - save.getTime())/1000)); 

          new RawSchemaUnorderedResultController(rawSchemaBatchResult._id).mapReduce(rawSchemaBatchResult._id, (mapReduceError2, mapReduceResult2) => {
          if (mapReduceError2) { return this.error(res, mapReduceError2, 500); }
            const mapreduce2 = new Date();
            console.log("mapreduce2 end in ",Math.abs((save.getTime() - mapreduce2.getTime())/1000));

            new RawSchemaOrderedResultController().saveResults(mapReduceResult2, rawSchemaBatchResult._id, (saveResultsError2) => {
              if (saveResultsError2) { return this.error(res, saveResultsError2, 500); }
              const save2 = new Date();
              console.log("save mapreduce2 end in ",Math.abs((mapreduce.getTime() - save2.getTime())/1000)); 
              return this.success(res, {"batchId":rawSchemaBatchResult._id});
            });
          });    
        });
      });
    });
  }

  aggregate = (req, res) => {
    this.getById(req.body.batchId, (rawSchemaBatchError, rawSchemaBatchResult) => {
      if (rawSchemaBatchError) { return this.error(res, rawSchemaBatchError, 500); }
      if (!rawSchemaBatchResult) { return this.error(res, `rawSchemaBatch with id: ${req.body.batchId} not found`, 404); }

      const start = new Date();
      new RawSchemaController().aggregate(rawSchemaBatchResult._id, (aggregateTemporaryError, aggregateTemporaryResult) => {
        if (aggregateTemporaryError) { return this.error(res, aggregateTemporaryError, 500); }
        const aggregate = new Date();
        console.log("aggregate1 end in ",Math.abs((start.getTime() - aggregate.getTime())/1000));

        new RawSchemaUnorderedResultController(rawSchemaBatchResult._id).aggregate(rawSchemaBatchResult._id, (aggregateError, aggregateResult) => {
          if (aggregateError) { return this.error(res, aggregateError, 500); }
          const aggregate2 = new Date();
          console.log("aggregate2 end in ",Math.abs((aggregate.getTime() - aggregate2.getTime())/1000));

          new RawSchemaOrderedResultController().saveResults(aggregateResult, rawSchemaBatchResult._id, (saveResultsError) => {
            if (saveResultsError) { return this.error(res, saveResultsError, 500); }
            const save2 = new Date();
            console.log("save aggregate2 end in ",Math.abs((aggregate2.getTime() - save2.getTime())/1000)); 
            return this.success(res, {"batchId":rawSchemaBatchResult._id});
          });
        });
      });
    });
  }

  aggregateAndReduce = (req, res) => {
    this.getById(req.body.batchId, (rawSchemaBatchError, rawSchemaBatchResult) => {
      if (rawSchemaBatchError) { return this.error(res, rawSchemaBatchError, 500); }
      if (!rawSchemaBatchResult) { return this.error(res, `rawSchemaBatch with id: ${req.body.batchId} not found`, 404); }

      const start = new Date();
      new RawSchemaController().aggregate(rawSchemaBatchResult._id, (aggregateTemporaryError, aggregateTemporaryResult) => {
        if (aggregateTemporaryError) { return this.error(res, aggregateTemporaryError, 500); }
        const aggregate = new Date();
        console.log("aggregate end in ",Math.abs((start.getTime() - aggregate.getTime())/1000));

        new RawSchemaUnorderedResultController(rawSchemaBatchResult._id).mapReduce(rawSchemaBatchResult._id, (aggregateError, aggregateResult) => {
          if (aggregateError) { return this.error(res, aggregateError, 500); }
          const mapReduce = new Date();
          console.log("mapreduce end in ",Math.abs((aggregate.getTime() - mapReduce.getTime())/1000));

          new RawSchemaOrderedResultController().saveResults(aggregateResult, rawSchemaBatchResult._id, (saveResultsError) => {
            if (saveResultsError) { return this.error(res, saveResultsError, 500); }
            const save2 = new Date();
            console.log("save mapreduce end in ",Math.abs((mapReduce.getTime() - save2.getTime())/1000)); 
            return this.success(res, {"batchId":rawSchemaBatchResult._id});
          });
        });
      });
    });
  }

  save = function(rawSchemaBatch, callback){
    rawSchemaBatch.save((err, doc) => {
      if (err) { return callback(err, null); }
      callback(null, doc);
    });
  }

  getById = function(id, callback){
  	this.model.findById(id, (err, doc) => {
      if (err) { return callback(err, null); }
      callback(null, doc);
    });
  }
 
}
