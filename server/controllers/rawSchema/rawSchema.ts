import * as mongoose from 'mongoose';
import {ObjectId}           from 'mongodb';
import rawSchemaSchema      from '../../models/rawSchema/rawSchema';
import options              from '../../params/mapReduceParam';
import BaseController  from '../base';

declare var emit;

export default class RawSchemaController extends BaseController {
  
  model = null;

  constructor(batchId: String) {
    super();
    const rawSchemaCollectionName = `rawSchema${batchId}`;
    const RawSchema = mongoose.model(rawSchemaCollectionName, rawSchemaSchema);
    this.model = RawSchema;
  }

  saveAll = (rawSchemas, batchId): Promise<any> => {
    return new Promise((resolv, reject) => {
      this.model.insertMany(rawSchemas, { ordered: true }).then((data) => {
        return resolv(data);
      }).catch((error) => {
        return reject(error);
      });
    });
  }

  aggregate = (batchId): Promise<any> => {
    return new Promise((resolv, reject) => {
      this.model.aggregate([
        { $project: { batchId: 1 , docRawSchema: 1, value:1 } },
        { $group: { _id:"$docRawSchema", value:{$sum:1}, batchId: { $last: "$batchId" }, docRawSchema: { $last: "$docRawSchema" } } },
        { $out: `rawschemaunordered${batchId}results` }
      ]).allowDiskUse(true).exec().then((data) => {
        return resolv(data);
      }).catch((error) => {
        console.error("error",error);
        return reject(error);
      });
    });
  }

  mapReduce = (batchId): Promise<any> => {
    return new Promise((resolv, reject) => {
      options.out = { 'inline':1 };
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
      this.model.mapReduce(options).then((data) => {
        return resolv(data);
      }).catch((error) => {
         console.error("error",error);
         return reject(error);
      });
    });
  }

}
