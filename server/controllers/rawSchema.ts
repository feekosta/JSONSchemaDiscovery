import {ObjectId} from 'mongodb';

import RawSchema from '../models/rawSchema';

import BaseController from './base';

import options from '../params/mapReduceParam';

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

  aggregate = (rawSchemaBatchId, callback) => {
    const start = new Date();
    this.model.aggregate([
      { $match:{ rawSchemaBatchId:ObjectId(rawSchemaBatchId)}},
      { $group:{ _id:"$docRawSchema", value:{$sum:1} }}
     ], function (aggregateError, results) {
        if (aggregateError) {
          return callback(aggregateError, null);
        } else {
          console.log("aggregate end in ",Math.abs((start.getTime() - new Date().getTime())/1000));
          return callback(null, results);
        }
    });
  }

  mapReduce = (rawSchemaBatchId, callback) => {
    const start = new Date();
    options.query = {'rawSchemaBatchId':rawSchemaBatchId};
    options.map = function() { 
      emit(this.docRawSchema, 1); 
    };
    options.reduce = function(key, values) { 
      let count = 0;
      values.forEach((value) => {
        count += value;
      });
      return count;
    };
    this.model.mapReduce(options, (mapReduceError, results) => {
      if (mapReduceError) { return callback(mapReduceError, null); }
      console.log("mapreduce end in ",Math.abs((start.getTime() - new Date().getTime())/1000));
      callback(null, results);
    });
  }

}
