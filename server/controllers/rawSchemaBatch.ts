import * as mongodb from 'mongodb';

import RawSchemaBatch from '../models/rawSchemaBatch';

import BaseController from './base';
import RawSchemaController from './rawSchema';

import rawSchemaParse from '../helpers/rawSchemaParse';

export default class RawSchemaBatchController extends BaseController {
  
  model = RawSchemaBatch;

  discovery = (req, res) => {
    let params = req.body;
    let dbUrl = params.dbUrl.indexOf("mongodb://") !== -1 ? params.dbUrl : "mongodb://"+params.dbUrl;
    let dbUri = params.dbUrl+'/'+params.dbName;
    let rawSchemaBatch = new this.model();
    rawSchemaBatch.collectionName = params.dbCollection;
    rawSchemaBatch.dbUri = dbUri;
    rawSchemaBatch.userId = params.userId;
    this.save(rawSchemaBatch, (saveError, doc) => {
      if (saveError) { return this.error(res, saveError, 500); }
      mongodb(dbUri, (dbError, database) => {
        if (dbError) { return this.error(res, dbError, 500); }
        let collection = database.collection(params.dbCollection).find();
        this.discoveryRawSchemaFromCollection(collection, (discoveryError, rawSchemas) => {
          database.close();
          if (discoveryError) { return this.error(res, discoveryError, 500); }
          let rawSchemaController = new RawSchemaController();
          rawSchemaController.saveAll(rawSchemas, doc._id, (saveAllError) => {
            if (saveAllError) { return this.error(res, saveAllError, 500); }
            return this.success(res, {"rawSchemaBatchId":doc._id});
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
  
  discoveryRawSchemaFromCollection(collection, callback){
    let result;
    collection.stream()
      .pipe(rawSchemaParse())
      .on('data', (data) => { result = data; })
      .on('error', (err) => { callback(err, null); })
      .on('end', () => { callback(null, result); });
  }
  
}
