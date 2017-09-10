import * as mongoose from 'mongoose';

const rawSchemaBatchSchema = new mongoose.Schema({
  'userId': { type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true },
  'collectionName': { type: String, required: true },
  'collectionCount':{ type: Number, requried: true },
  'dbUri': { type: String, required: true },
  'elapsedTime': { type: String },
  'status': { type: String, required: true },
  'statusMessage': { type: String },
  'startDate': { type: Date },
  'endDate': { type: Date },
  'unorderedMapReduceElapsedTime': {type:String},
  'orderedMapReduceElapsedTime': {type:String},
  'unorderedAggregationElapsedTime': {type:String},
  'orderedAggregationElapsedTime': {type:String}
},{ timestamps: { createdAt: 'createdAt' } });

export default mongoose.model('RawSchemaBatch', rawSchemaBatchSchema);