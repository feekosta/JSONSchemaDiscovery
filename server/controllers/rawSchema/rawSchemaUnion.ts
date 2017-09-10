import RawSchemaUnion 			from '../../models/rawSchema/rawSchemaUnion';
import RawSchemaUnifier		 	from '../../helpers/rawSchema/rawSchemaUnifier';
import BatchBaseController		from '../batchBase';

export default class RawSchemaUnionController extends BatchBaseController {
  
	model = RawSchemaUnion;

	save = (rawSchemaUnion, callback) => {
		rawSchemaUnion.save((err, item) => {
			if (err) { return callback(err, null); }
			callback(null, item);
		});
	}

	union = (rawSchemaResults, batchId, callback) => {
		new RawSchemaUnifier().union(rawSchemaResults, (unionError, rawSchemaFinal) => {
			if (unionError) { return callback(unionError, null); }
			const rawSchemaUnion = new RawSchemaUnion();
			rawSchemaUnion.batchId = batchId;
			rawSchemaUnion.rawSchemaFinal = JSON.stringify(rawSchemaFinal);
			this.save(rawSchemaUnion, (saveError) => {
				if (saveError) { return callback(saveError, null); }
				callback(null, {"batchId":batchId})
			});
		});
	}
	
}
