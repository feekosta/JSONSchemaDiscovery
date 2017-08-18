import RawSchemaUnion from '../models/rawSchemaUnion';

import BaseController from './base';

import RawSchemaHashMapUnionHelper from '../helpers/rawSchemaHashMapUnionHelper';

export default class RawSchemaUnionController extends BaseController {
  
	model = RawSchemaUnion;

	save = (rawSchemaUnion, callback) => {
		rawSchemaUnion.save((err, item) => {
			if (err) { return callback(err, null); }
			callback(null, item);
		});
	}

	hasMapUnionListByBatchId = (req, res) => {
		this.model.find({ 'rawSchemaBatchId': req.params.id, "type":"HASHMAP" }, (err, docs) => {
			if (err) { return this.error(res, err, 404); }
			this.success(res, docs);
		});
	}

	finalRawSchemaListByBatchId = (req, res) => {
		this.model.find({ 'rawSchemaBatchId': req.params.id, "type":"HASHMAP" }, (err, docs) => {
			if (err) { return this.error(res, err, 404); }
			let response = [];
			docs.forEach((item) => {
				response.push(JSON.parse(item.finalRawSchema));
			});
			this.success(res, response);
		});
	}

	hasMapUnionDeleteByBatchId = (req, res) => {
		this.model.remove({ 'rawSchemaBatchId': req.params.id, "type":"HASHMAP" }, (err) => {
			if (err) { return this.error(res, err, 404); }
			this.success(res, null);
		});
	}

	hasMapUnionCount = (req, res) => {
		this.model.find({ "type":"HASHMAP" }).count((err, count) => {
			if (err) { return this.error(res, err, 404); }
			this.success(res, count);
		});
	}

	hashMapUnion = (rawSchemaResults, rawSchemaBatchId, callback) => {
		new RawSchemaHashMapUnionHelper().union(rawSchemaResults, (unionError, finalRawSchema) => {
			if (unionError) { return callback(unionError, null); }
			let rawSchemaUnion = new RawSchemaUnion();
			rawSchemaUnion.rawSchemaBatchId = rawSchemaBatchId;
			rawSchemaUnion.finalRawSchema = JSON.stringify(finalRawSchema);
			rawSchemaUnion.type = "HASHMAP";
			this.save(rawSchemaUnion, (saveError) => {
				if (saveError) { return callback(saveError, null); }
				callback(null, {"rawSchemaBatchId":rawSchemaBatchId})
			});
		});
	}
	
}
