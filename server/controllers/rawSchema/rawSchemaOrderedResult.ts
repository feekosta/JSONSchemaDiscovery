import RawSchemaOrderedResult from '../../models/rawSchema/rawSchemaOrderedResult';
import BatchBaseController from '../batchBase';
import RawSchemaUnionController from './rawSchemaUnion';

export default class RawSchemaOrderedResultController extends BatchBaseController {
  
	model = RawSchemaOrderedResult;

	union = (req, res) => {
		this.listEntitiesByBatchId(req.body.batchId).then((data) => {
			return new RawSchemaUnionController().union(data, req.body.batchId);
		}).then((data) => {
			return this.success(res, data);
		}).catch((error) => {
			return this.error(res, error, 404);
		});
	}

	saveResults = (mapReduceResults, batchId) => {
		return new Promise((resolv, reject) => {
			this.deleteEntitiesByBatchId(batchId).then((data) => {
				const rawSchemaOrderedResults = this.buildRawSchemaOrderedResults(mapReduceResults, batchId);
				this.model.insertMany(rawSchemaOrderedResults, { ordered: true }).then((data) => {
					return resolv(data);
				}, (error) => {
					return reject(error);
				});
			}, (error) => {
				return reject(error);
			});
		});
	}

	private buildRawSchemaOrderedResults = (results, batchId) => {
		const rawSchemaOrderedResults = [];
		results.forEach((result) => {
			const rawSchemaOrderedResult = this.model({
				"batchId": batchId,
				"rawSchema": result._id,
				"count": result.value
			});
			rawSchemaOrderedResults.push(rawSchemaOrderedResult);
		});
		return rawSchemaOrderedResults;
	}

}
