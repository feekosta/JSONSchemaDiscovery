import * as co from 'co';
import * as mongodb from 'mongodb';
import {MongoClient} from 'mongodb'

import RawSchemaBatch from '../models/rawSchemaBatch';

import BaseController from './base';
import RawSchemaController from './rawSchema';
import RawSchemaResultController from './rawSchemaResult';

import RawSchemaProcessWorker from '../helpers/rawSchemaProcessWorker';

import DatabaseParam from '../params/databaseParam';

export default class RawSchemaBatchController extends BaseController {
  
  model = RawSchemaBatch;

  discovery = (req, res) => {
    let data = JSON.parse(JSON.stringify(req.body));
    let databaseParam = new DatabaseParam(data);
    let rawSchemaBatch = new this.model();
    rawSchemaBatch.collectionName = databaseParam.collectionName;
    rawSchemaBatch.dbUri = databaseParam.getURIWithoutAuthentication();
    rawSchemaBatch.userId = databaseParam.userId;
    this.getDatabaseConnection(res, databaseParam, (database) => {
      let collection = database.collection(databaseParam.collectionName);
      this.setCollectionSize(res, collection, rawSchemaBatch, (count) => {});
      rawSchemaBatch.startDate = new Date();
      this.success(res, rawSchemaBatch._id);
      const worker = new RawSchemaProcessWorker();
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
        });
    });
  }

  setCollectionSize = (res, collection, rawSchemaBatch, callback) => {
    return co(function*() {
      const count = yield collection.count();
      return count;
    }).then((resp) => {
      rawSchemaBatch.collectionCount = resp;
      rawSchemaBatch.status = "IN_PROGRESS";
      this.save(rawSchemaBatch, (rawSchemaBatchSaveError, rawSchemaBatchSaved) => {
        if(rawSchemaBatchSaveError) { throw rawSchemaBatchSaveError; }
        return callback(resp);
      });
    }).catch((err) => {
      return this.error(res, err, 500);
    });
  }

  getDatabaseConnection = (res, databaseParam, callback) => {
    return co(function*() {
      const url = databaseParam.getURI();
      const database = yield MongoClient.connect(url);
      return database;
    }).then((resp) => {
      return callback(resp);
    }).catch((err) => {
      return this.error(res, err, 500);
    });
  }

  reduce = (req, res) => {
    this.getById(req.body.rawSchemaBatchId, (getError, rawSchemaBatch) => {
      if (getError) { return this.error(res, getError, 500); }
      if (!rawSchemaBatch) { return this.error(res, `rawSchemaBatch with id: ${req.body.rawSchemaBatchId} not found`, 404); }
      let rawSchemaController = new RawSchemaController();
      rawSchemaController.mapReduce(rawSchemaBatch._id, (mapReduceError, mapReduceResults) => {
        if (mapReduceError) { return this.error(res, mapReduceError, 500); }
        let rawSchemaResultController = new RawSchemaResultController();
        rawSchemaResultController.saveResults(mapReduceResults, rawSchemaBatch._id, (saveResultsError) => {
          if (saveResultsError) { return this.error(res, saveResultsError, 500); }
          return this.success(res, {"rawSchemaBatchId":rawSchemaBatch._id});
        });
      });
    });
  }

  aggregate = (req, res) => {
    this.getById(req.body.rawSchemaBatchId, (getError, rawSchemaBatch) => {
      if (getError) { return this.error(res, getError, 500); }
      if (!rawSchemaBatch) { return this.error(res, `rawSchemaBatch with id: ${req.body.rawSchemaBatchId} not found`, 404); }
      let rawSchemaController = new RawSchemaController();
      rawSchemaController.aggregate(rawSchemaBatch._id, (aggregateError, aggregateResults) => {
        if (aggregateError) { return this.error(res, aggregateError, 500); }
        let rawSchemaResultController = new RawSchemaResultController();
        rawSchemaResultController.saveResults(aggregateResults, rawSchemaBatch._id, (saveResultsError) => {
          if (saveResultsError) { return this.error(res, saveResultsError, 500); }
          return this.success(res, {"rawSchemaBatchId":rawSchemaBatch._id});
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
