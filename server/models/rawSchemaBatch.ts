import * as mongoose from 'mongoose';

const rawSchemaBatchSchema = new mongoose.Schema({
  'userId': {type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true},
  'collectionName': { type: String, required: true },
  'collectionCount':{ type: Number, required: true },
  'dbUri': { type: String, required: true }
},{ timestamps: { createdAt: 'createdAt' } });

const RawSchemaBatch = mongoose.model('RawSchemaBatch', rawSchemaBatchSchema);

export default RawSchemaBatch;