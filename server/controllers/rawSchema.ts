import BaseController from './base';

import RawSchema from '../models/rawSchema';

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

}
