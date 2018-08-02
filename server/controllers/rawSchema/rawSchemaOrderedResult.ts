import * as mongoose from 'mongoose';
import rawSchemaOrderedResultSchema from '../../models/rawSchema/rawSchemaOrderedResult';
import BaseController from '../base';
import RawSchemaUnionController from './rawSchemaUnion';
import RawSchemaBatch from './rawSchemaBatch';

export default class RawSchemaOrderedResultController extends BaseController {

  model = null;

  constructor(batchId: String) {
    super();
    const rawSchemaOrderedResultCollectionName = `rawSchemaOrdered${batchId}Result`;
    const RawSchemaOrderedResult = mongoose.model(rawSchemaOrderedResultCollectionName, rawSchemaOrderedResultSchema);
    this.model = RawSchemaOrderedResult;
  }

  union = (batchId): Promise<any> => {
    return new Promise((resolv, reject) => {
      let rawSchemaBatch;
      new RawSchemaBatch().getById(batchId).then((data) => {
        if (!data)
          return reject({'message': `no results for batchId: ${batchId}`, 'code': 404});
        rawSchemaBatch = data;
        return this.listAllEntities();
      }).then((data) => {
        return new RawSchemaUnionController().union(data, batchId);
      }).then((data) => {
        rawSchemaBatch.unionDate = new Date();
        rawSchemaBatch.status = 'MAPPER_JSONSCHEMA';
        rawSchemaBatch.save().then((data) => {

        }).catch((error => {

        }));
        return resolv(data);
      }).catch((error) => {
        console.error('union error', error);
        return reject({'type': 'UNION_DOCUMENTS_ERROR', 'message': error.message, 'code': 500});
      });
    });
  };

}
