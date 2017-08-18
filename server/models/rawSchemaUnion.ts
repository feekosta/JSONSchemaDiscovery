import * as mongoose from 'mongoose';

const rawSchemaUnionSchema = new mongoose.Schema({
  'rawSchemaBatchId': {type: mongoose.Schema.Types.ObjectId, ref: 'RawSchemaBatch', required:true},
  'type': { type: String, required: true },
  'finalRawSchema': { type: String, required: true }
},{ timestamps: { createdAt: 'createdAt' } });

const RawSchemaUnion = mongoose.model('RawSchemaUnion', rawSchemaUnionSchema);

export default RawSchemaUnion;