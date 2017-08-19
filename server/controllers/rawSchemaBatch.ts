import * as mongodb from 'mongodb';

import RawSchemaBatch from '../models/rawSchemaBatch';
import RawSchemaResult from '../models/rawSchemaResult';

import BaseController from './base';
import RawSchemaController from './rawSchema';
import RawSchemaResultController from './rawSchemaResult';

import rawSchemaParser from '../helpers/rawSchemaParser';

import DatabaseParam from '../params/databaseParam';

export default class RawSchemaBatchController extends BaseController {
  
  model = RawSchemaBatch;

  discovery = (req, res) => {
    let startDate = new Date();
    let data = JSON.parse(JSON.stringify(req.body));
    let databaseParam = new DatabaseParam(data);
    let rawSchemaBatch = new this.model();
    rawSchemaBatch.collectionName = databaseParam.collectionName;
    rawSchemaBatch.dbUri = databaseParam.getURIWithoutAuthentication();
    rawSchemaBatch.userId = databaseParam.userId;
    mongodb(databaseParam.getURI(), (dbError, database) => {
      if (dbError) { return this.error(res, dbError, 500); }
      let collection = database.collection(databaseParam.collectionName);
      collection.find({}, (err, docs) => {
        this.discoveryRawSchemaFromCollection(docs, (discoveryError, rawSchemas) => {
          database.close();
          if (discoveryError) { return this.error(res, discoveryError, 500); }
          rawSchemaBatch.collectionCount = rawSchemas.length;
          let endDate = new Date();
          rawSchemaBatch.elapsedTime = Math.abs((startDate.getTime() - endDate.getTime())/1000)
          this.save(rawSchemaBatch, (rawSchemaBatchSaveError, rawSchemaBatchSaved) => {
            if (rawSchemaBatchSaveError) { return this.error(res, discoveryError, 500); }
            let rawSchemaController = new RawSchemaController();
            rawSchemaController.saveAll(rawSchemas, rawSchemaBatchSaved._id, (saveAllError) => {
              if (saveAllError) { return this.error(res, saveAllError, 500); }
              return this.success(res, {"rawSchemaBatchId":rawSchemaBatchSaved._id});
            });
          });
        });
      });
    });
  }

  reduce = (req, res) => {
    this.getById(req.body.rawSchemaBatchId, (getError, rawSchemaBatch) => {
      if (getError) { return this.error(res, getError, 500); }
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
  
  discoveryRawSchemaFromCollection(collection, callback){
    let result;
    collection.stream()
      .pipe(rawSchemaParser())
      .on('data', (data) => { result = data; })
      .on('error', (err) => { callback(err, null); })
      .on('end', () => { callback(null, result); });
  }
  
}
