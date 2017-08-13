import * as mongoose from 'mongoose';

const rawSchemaSchema = new mongoose.Schema({
  'rawSchemaBatchId': {type: mongoose.Schema.Types.ObjectId, ref: 'RawSchemaBatch', required:true},
  'docId': { type: String, required: true },
  'docRawSchema': { type: String, required: true }
},{ timestamps: { createdAt: 'createdAt' } });

const RawSchema = mongoose.model('RawSchema', rawSchemaSchema);

export default RawSchema;