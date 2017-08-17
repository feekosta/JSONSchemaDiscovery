import RawSchema from '../models/rawSchema';

import BaseController from './base';

import options from '../helpers/mapReduceOptions';

declare var emit;

export default class RawSchemaController extends BaseController {
  
  model = RawSchema;

  saveAll = (rawSchemas, rawSchemaBatchId, callback) => {
    rawSchemas.forEach((rawSchema) => {
      let obj = new this.model(rawSchema);
      obj.rawSchemaBatchId = rawSchemaBatchId;
      obj.save((err) => {
        if (err) { return callback(err, null)}
      });
    });
    callback(null, "OK");
  }

  listByBatchId = (req, res) => {
    this.model.find({ 'rawSchemaBatchId': req.params.id }, (err, docs) => {
      if (err) { return this.error(res, err, 404); }
      this.success(res, docs);
    });
  }

  deleteByBatchId = (req, res) => {
    this.model.remove({ 'rawSchemaBatchId': req.params.id }, (err) => {
      if (err) { return this.error(res, err, 404); }
      this.success(res, null);
    });
  }

  countByBatchId = (req, res) => {
    this.model.find({ 'rawSchemaBatchId': req.params.id }).count((err, count) => {
      if (err) { return this.error(res, err, 404); }
      this.success(res, count);
    });
  }

  mapReduce = (rawSchemaBatchId, callback) => {
    options.query = {'rawSchemaBatchId':rawSchemaBatchId};
    options.map = function() { 
      emit(this.docRawSchema, 1); 
    };
    options.reduce = function(key, values) { 
      var count = 0;
      values.forEach((value) =>{
        count += value;
      })
      return count;
    };
    this.model.mapReduce(options, (mapReduceError, results) => {
      if (mapReduceError) { return callback(mapReduceError, null); }
      console.log("results"+results);
      callback(null, results);
    });
  }

}
