import JsonSchemaExtracted from '../models/jsonSchemaExtracted';

import BaseController from './base';
import RawSchemaUnion from './rawSchemaUnion';

import JsonSchemaBuilder from '../helpers/jsonSchemaBuilder';

export default class JsonSchemaExtractedController extends BaseController {
  
  model = JsonSchemaExtracted;

  generate = (req, res) => {
    new RawSchemaUnion().getByBatchId(req.body.rawSchemaBatchId, (getError, rawSchemaUnion) => {
      if (getError) { return this.error(res, getError, 500); }
      if (!rawSchemaUnion) { return this.error(res, `rawSchemaUnion for batchId: ${req.body.rawSchemaBatchId} not found`, 404); }
      new JsonSchemaBuilder().build(JSON.parse(rawSchemaUnion.finalRawSchema).fields, (error, jsonschema) => {
      	this.model = new JsonSchemaExtracted();
      	this.model.rawSchemaBatchId = req.body.rawSchemaBatchId;
      	this.model.jsonSchema = JSON.stringify(jsonschema);
      	this.model.save(this.model, (saveError) => {
			if (saveError) { return this.error(res, saveError, 500); }
        	this.success(res, jsonschema);
		});
      });
    });
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
