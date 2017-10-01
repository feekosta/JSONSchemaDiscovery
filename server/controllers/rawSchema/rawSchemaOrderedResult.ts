import RawSchemaOrderedResult from '../../models/rawSchema/rawSchemaOrderedResult';
import BatchBaseController from '../batchBase';
import RawSchemaUnionController from './rawSchemaUnion';
import RawSchemaBatch from './rawSchemaBatch';

export default class RawSchemaOrderedResultController extends BatchBaseController {
  
	model = RawSchemaOrderedResult;

	union = (batchId): Promise<any> => {
		return new Promise((resolv, reject) => {
			let rawSchemaBatch;
			new RawSchemaBatch().getById(batchId).then((data) => {
				if(!data)
					reject({"message":`no results for batchId: ${batchId}`,"code":404});
				rawSchemaBatch = data;
				return this.listEntitiesByBatchId(batchId);
			}).then((data) => {
				return new RawSchemaUnionController().union(data, batchId);
			}).then((data) => {
				rawSchemaBatch.unionDate = new Date();
				rawSchemaBatch.status = "MAPPER_JSONSCHEMA";
				rawSchemaBatch.save();
				return resolv(data);
			}).catch((error) => {
				return reject({"message":error,"code":404});
			});
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
