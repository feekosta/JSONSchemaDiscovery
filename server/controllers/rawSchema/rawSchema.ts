import {ObjectId}           from 'mongodb';
import RawSchema            from '../../models/rawSchema/rawSchema';
import options              from '../../params/mapReduceParam';
import BatchBaseController  from '../batchBase';

declare var emit;

export default class RawSchemaController extends BatchBaseController {
  
  model = RawSchema;

  saveAll = (rawSchemas, batchId, callback) => {
    rawSchemas.forEach((rawSchema) => {
      const obj = new this.model(rawSchema);
      obj.batchId = batchId;
      obj.save((err) => {
        if (err) { return callback(err, null)}
      });
    });
    callback(null, "OK");
  }

  aggregate = (batchId, callback) => {
    this.model.aggregate([
        { $match: { batchId:ObjectId(batchId) } },
        { $project: { batchId: 1 , docRawSchema: 1, value:1 } },
        { $group: { _id:"$docRawSchema", value:{$sum:1}, batchId: { $last: "$batchId" }, docRawSchema: { $last: "$docRawSchema" } } },
        { $out: `rawschemaunordered${batchId}results` }
      ]).allowDiskUse(true).exec((aggregateError, aggregateResult) => {
        if (aggregateError) { return callback(aggregateError, null); }
        callback(null, aggregateResult);
      });
  }

  mapReduce = (batchId, callback) => {
    options.query = { 'batchId':batchId };
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
    this.model.mapReduce(options, (mapReduceError, mapReduceResult) => {
      if (mapReduceError) { return callback(mapReduceError, null); }
      callback(null, mapReduceResult);
    });
  }

}
