import JsonSchemaExtracted from '../../models/jsonSchema/jsonSchemaExtracted';
import BatchBaseController from '../batchBase';
import RawSchemaUnion from '../rawSchema/rawSchemaUnion';
import RawSchemaBatch from '../rawSchema/rawSchemaBatch';  
import JsonSchemaBuilder from '../../helpers/jsonSchema/jsonSchemaBuilder';

export default class JsonSchemaExtractedController extends BatchBaseController {

  model = JsonSchemaExtracted;

  generate = (batchId): Promise<any> => {
    return new Promise((resolv, reject) => {
      let rawSchemaBatch;
      new RawSchemaBatch().getById(batchId).then((data) => {
        if(!data)
          reject({"message":`no results for batchId: ${batchId}`,"code":404});
        rawSchemaBatch = data;
        return new RawSchemaUnion().listEntitiesByBatchId(batchId);
      }).then((data) => {
        return this.buildJsonSchema(data, batchId);
      }).then((data) => {
        rawSchemaBatch.endDate = new Date();
        rawSchemaBatch.status = "DONE";
        rawSchemaBatch.save();
        return resolv(data);
      }).catch((error) => {
        return reject({"message": error, "code": 500});
      });
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
