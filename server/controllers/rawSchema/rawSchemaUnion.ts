import RawSchemaUnion from '../../models/rawSchema/rawSchemaUnion';
import RawSchemaUnifier from '../../helpers/rawSchema/rawSchemaUnifier';
import BatchBaseController from '../batchBase';

export default class RawSchemaUnionController extends BatchBaseController {
  
	model = RawSchemaUnion;

	union = (rawSchemaResults, batchId): Promise<any> => {
		return new Promise((resolv, reject) => {
			if(!rawSchemaResults || rawSchemaResults.length == 0)
				throw `no results for batchId: ${batchId}`;
			const rawSchemaFinal = new RawSchemaUnifier().union(rawSchemaResults);
			const rawSchemaUnion = new RawSchemaUnion({
				"batchId": batchId,
				"rawSchemaFinal": JSON.stringify(rawSchemaFinal)
			});
			rawSchemaUnion.save().then((data) => {
				resolv(data);
			}, (error) => {
				reject(error);
			});
		});
	}
	
}
