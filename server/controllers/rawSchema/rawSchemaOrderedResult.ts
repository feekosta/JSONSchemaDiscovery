import RawSchemaOrderedResult 		from '../../models/rawSchema/rawSchemaOrderedResult';
import BatchBaseController 			from '../batchBase';
import RawSchemaUnionController 	from './rawSchemaUnion';

export default class RawSchemaOrderedResultController extends BatchBaseController {
  
	model = RawSchemaOrderedResult;

	saveResults = (mapReduceResults, batchId, callback) => {
		this.deleteEntitiesByBatchId(batchId, (err, res) => {
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
		});
	}

	union = (req, res) => {
		this.model.find({ 'batchId': req.body.batchId }, (rawSchemaError, rawSchemaOrderedResults) => {
			if (rawSchemaError) { return this.error(res, rawSchemaError, 404); }
			new RawSchemaUnionController().union(rawSchemaOrderedResults, req.body.batchId, (unionError, unionSuccess) => {
				if (unionError) { return this.error(res, unionError, 404); }
				this.success(res, unionSuccess);
			});
		});
	}
	
}
