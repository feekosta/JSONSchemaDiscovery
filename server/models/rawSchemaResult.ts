import * as mongoose from 'mongoose';

const rawSchemaResultSchema = new mongoose.Schema({
  'rawSchemaBatchId': {type: mongoose.Schema.Types.ObjectId, ref: 'RawSchemaBatch', required:true},
  'rawSchema': { type: String, required: true },
  'count': { type: String, required: true }
},{ timestamps: { createdAt: 'createdAt' } });

const RawSchemaResult = mongoose.model('RawSchemaResult', rawSchemaResultSchema);

export default RawSchemaResult;