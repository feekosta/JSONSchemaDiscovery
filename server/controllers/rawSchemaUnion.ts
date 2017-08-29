import RawSchemaUnion from '../models/rawSchemaUnion';

import BaseController from './base';

import RawSchemaUnifierTreeMap from '../helpers/rawSchemaUnifierTreeMap';

export default class RawSchemaUnionController extends BaseController {
  
	model = RawSchemaUnion;

	save = (rawSchemaUnion, callback) => {
		rawSchemaUnion.save((err, item) => {
			if (err) { return callback(err, null); }
			callback(null, item);
		});
	}

	treeMapUnionListByBatchId = (req, res) => {
		this.getByBatchId(req.params.id, (err, doc) => {
			if (err) { return this.error(res, err, 404); }
			this.success(res, doc);
		});
	}

	getByBatchId = (batchId, callback) => {
		this.model.findOne({ 'rawSchemaBatchId': batchId, 'type':'TREEMAP' }, (err, docs) => {
			if (err) { return callback(err, null); }
			callback(null, docs);
		});
	}

	treeMapUnionListFormatedByBatchId = (req, res) => {
		this.model.find({ 'rawSchemaBatchId': req.params.id, 'type':'TREEMAP' }, (err, docs) => {
			if (err) { return this.error(res, err, 404); }
			let response = [];
			docs.forEach((item) => {
				response.push(JSON.parse(item.finalRawSchema));
			});
			this.success(res, response);
		});
	}

	treeMapUnionDeleteByBatchId = (req, res) => {
		this.model.remove({ 'rawSchemaBatchId': req.params.id, 'type':'TREEMAP' }, (err) => {
			if (err) { return this.error(res, err, 404); }
			this.success(res, null);
		});
	}

	treeMapUnionCount = (req, res) => {
		this.model.find({ 'type':'TREEMAP' }).count((err, count) => {
			if (err) { return this.error(res, err, 404); }
			this.success(res, count);
		});
	}

	treeMapUnion = (rawSchemaResults, rawSchemaBatchId, callback) => {
		new RawSchemaUnifierTreeMap().union(rawSchemaResults, (unionError, finalRawSchema) => {
			if (unionError) { return callback(unionError, null); }
			let rawSchemaUnion = new RawSchemaUnion();
			rawSchemaUnion.rawSchemaBatchId = rawSchemaBatchId;
			rawSchemaUnion.finalRawSchema = JSON.stringify(finalRawSchema);
			rawSchemaUnion.type = "TREEMAP";
			this.save(rawSchemaUnion, (saveError) => {
				if (saveError) { return callback(saveError, null); }
				callback(null, {"rawSchemaBatchId":rawSchemaBatchId})
			});
		});
	}
	
}
