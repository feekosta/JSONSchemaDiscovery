import * as mongoose from 'mongoose';

const AlertSchema = new mongoose.Schema({
  'batchId': {type: mongoose.Schema.Types.ObjectId, ref: 'RawSchemaBatch', required: true},
  'userId': {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  'status': {type: String, required: true},
  'type': {type: String, required: true},
  'dbUri': {type: String, required: true},
  'collectionName': {type: String, required: true},
  'date': {type: Date, required: true},
}, {timestamps: {createdAt: 'createdAt'}});
export default mongoose.model('Alert', AlertSchema);
