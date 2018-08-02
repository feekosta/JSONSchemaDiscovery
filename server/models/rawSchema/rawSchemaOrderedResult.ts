import * as mongoose from 'mongoose';
import {Schema} from 'mongoose';

const rawSchemaOrderedResultSchema = new mongoose.Schema({
  'batchId': {type: mongoose.Schema.Types.ObjectId, ref: 'RawSchemaBatch', required: false},
  'docRawSchema': {type: String, required: false},
  'value': {type: Number, required: false},
  '_id': {type: Schema.Types.Mixed, required: false}
}, {timestamps: {createdAt: 'createdAt'}});

export default rawSchemaOrderedResultSchema;
