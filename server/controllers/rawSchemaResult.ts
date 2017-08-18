import RawSchemaResult from '../models/rawSchemaResult';

import BaseController from './base';
import RawSchemaUnionController from './rawSchemaUnion';

export default class RawSchemaResultController extends BaseController {
  
	model = RawSchemaResult;

	save = (rawSchemaResult, callback) => {
		rawSchemaResult.save((err, item) => {
			if (err) { return callback(err, null); }
			callback(null, item);
		});
	}

	saveResults = (mapReduceResults, rawSchemaBatchId, callback) => {
		mapReduceResults.forEach((mapReduceResult) => {
			let rawSchemaResult = this.model();
			rawSchemaResult.rawSchemaBatchId = rawSchemaBatchId;
			rawSchemaResult.rawSchema = mapReduceResult._id;
			rawSchemaResult.count = mapReduceResult.value;
			this.save(rawSchemaResult, (err) => {
				if (err) { return callback(err, null); }
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
  
	hashMapUnion = (req, res) => {
		const rawSchemaBatchId = req.body.rawSchemaBatchId;
		this.model.find({ 'rawSchemaBatchId': rawSchemaBatchId }, (err, rawSchemasResultByBatchId) => {
			if (err) { return this.error(res, err, 404); }
			let rawSchemaUnionController = new RawSchemaUnionController();
			rawSchemaUnionController.hashMapUnion(rawSchemasResultByBatchId, rawSchemaBatchId, (unionError, unionSuccess) => {
				if (unionError) { return this.error(res, unionError, 404); }
				this.success(res, unionSuccess);
			});
		});
	}
	
}
