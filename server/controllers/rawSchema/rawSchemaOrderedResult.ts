import RawSchemaOrderedResult 		from '../../models/rawSchema/rawSchemaOrderedResult';
import BatchBaseController 			from '../batchBase';
import RawSchemaUnionController 	from './rawSchemaUnion';

export default class RawSchemaOrderedResultController extends BatchBaseController {
  
	model = RawSchemaOrderedResult;

	saveResults = (mapReduceResults, batchId, callback) => {
		this.deleteEntitiesByBatchId(batchId).then((data) => {
			const rawSchemaOrderedResults = [];
			mapReduceResults.forEach((result) => {
				let rawSchemaOrderedResult = this.model();
				rawSchemaOrderedResult.batchId = batchId;
				rawSchemaOrderedResult.rawSchema = result._id;
				rawSchemaOrderedResult.count = result.value;
				rawSchemaOrderedResults.push(rawSchemaOrderedResult);
			});
			this.model.insertMany(rawSchemaOrderedResults, { ordered: true }, (error, res) => {
				callback(null, "OK");	
			});
		}, (error) => {
			
		});
	}

	union = (req, res) => {
		this.listEntitiesByBatchId(req.body.batchId).then((data) => {
			return new RawSchemaUnionController().union(data, req.body.batchId);
		}).then((data) => {
			return this.success(res, data);
		}).catch((error) => {
			return this.error(res, error, 404);
		});
	}
	
}
