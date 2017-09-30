import JsonSchemaExtracted from '../../models/jsonSchema/jsonSchemaExtracted';
import BatchBaseController from '../batchBase';
import RawSchemaUnion from '../rawSchema/rawSchemaUnion';
import JsonSchemaBuilder from '../../helpers/jsonSchema/jsonSchemaBuilder';

export default class JsonSchemaExtractedController extends BatchBaseController {

  model = JsonSchemaExtracted;

  generate = (req, res) => {
    const batchId = req.body.batchId;
    new RawSchemaUnion().listEntitiesByBatchId(batchId).then((data) => {
      return this.buildJsonSchema(data, batchId);
    }).then((data) => {
      return this.success(res, data);
    }).catch((error) => {
      return this.error(res, error, 500);
    });
  }

  private buildJsonSchema = (rawSchemaUnions, batchId): Promise<any> => {
    return new Promise((resolv, reject) => {
      const rawSchemaUnion = rawSchemaUnions.pop();
      if (!rawSchemaUnion)
        throw `no results for batchId: ${batchId}`;
      const rawSchemaFinal = JSON.parse(rawSchemaUnion.rawSchemaFinal);
      const jsonSchemaGenerated = new JsonSchemaBuilder().build(rawSchemaFinal.fields, rawSchemaFinal.count);
      const jsonSchemaExtracted = new JsonSchemaExtracted({
        batchId: batchId, 
        jsonSchema: JSON.stringify(jsonSchemaGenerated)
      });
      jsonSchemaExtracted.save().then((data) => {
        return resolv(data);
      }, (error) => {
        return reject(error);
      });
    });
  }

}
