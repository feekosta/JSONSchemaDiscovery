import JsonSchemaExtracted      from '../../models/jsonSchema/jsonSchemaExtracted';
import BatchBaseController      from '../batchBase';
import RawSchemaUnion           from '../rawSchema/rawSchemaUnion';
import JsonSchemaBuilder        from '../../helpers/jsonSchema/jsonSchemaBuilder';

export default class JsonSchemaExtractedController extends BatchBaseController {

  model = JsonSchemaExtracted;

  generate = (req, res) => {

    new RawSchemaUnion().listEntitiesByBatchId(req.body.batchId, (unionError, unionResult) => {
      if (unionError) { return this.error(res, unionError, 500); }
      const rawSchemaUnion = unionResult.pop();
      if (!rawSchemaUnion) { return this.error(res, `rawSchemaUnion for batchId: ${req.body.batchId} not found`, 404); }
      const rawSchemaFinal = JSON.parse(rawSchemaUnion.rawSchemaFinal);
      const jsonSchemaGenerated = new JsonSchemaBuilder().build(rawSchemaFinal.fields, rawSchemaFinal.count);
      const jsonSchemaExtracted = new JsonSchemaExtracted({
        batchId: req.body.batchId, 
        jsonSchema: JSON.stringify(jsonSchemaGenerated)
      });
    	jsonSchemaExtracted.save(jsonSchemaGenerated, (saveError) => {
  			if (saveError) { return this.error(res, saveError, 500); }
      	this.success(res, jsonSchemaGenerated);
      });
    });
  }

}
