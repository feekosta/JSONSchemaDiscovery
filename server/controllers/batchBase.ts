import BaseController from './base';

abstract class BatchBaseController extends BaseController {
  
  	listByBatchId = (req, res) => {
  		this.listEntitiesByBatchId(req.params.id, (err, docs) => {
			if (err) { return this.error(res, err, 404); }
			this.success(res, docs);
		});
	}

	listEntitiesByBatchId = (batchId, callback) => {
		this.model.find({ 'batchId':batchId }, callback);
	}

	deleteByBatchId = (req, res) => {
		this.deleteEntitiesByBatchId(req.params.id, (err) => {
			if (err) { return this.error(res, err, 404); }
			this.success(res, "OK");
		});
	}

	deleteEntitiesByBatchId = (batchId, callback) => {
		this.model.remove({ 'batchId': batchId }, callback);
	}

	countByBatchId = (req, res) => {
		this.countEntitiesByBatchId(req.params.id, (err, count) => {
			if (err) { return this.error(res, err, 404); }
			this.success(res, count);
		});
	}

	countEntitiesByBatchId = (batchId, callback) => {
		this.model.find({ 'batchId': batchId }).count(callback);
	}

}

export default BatchBaseController;