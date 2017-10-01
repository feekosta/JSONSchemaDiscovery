import * as mongoose from 'mongoose';

const rawSchemaBatchSchema = new mongoose.Schema({
  'userId': { type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true },
  'collectionName': { type: String, required: true },
  'dbUri': { type: String, required: true },
  'collectionCount':{ type: Number, requried: true },
  'uniqueUnorderedCount':{ type: Number },
  'uniqueOrderedCount':{ type: Number },
  'status': { type: String, required: true },
  'statusMessage': { type: String },
  'reduceType': { type: String },
  'startDate': { type: Date },
  'extractionDate': { type: Date },
  'unorderedMapReduceDate': {type:Date},
  'orderedMapReduceDate': {type:Date},
  'unorderedAggregationDate': {type:Date},
  'orderedAggregationDate': {type:Date},
  'unionDate': {type:Date},
  'endDate': { type: Date }
},{ timestamps: { createdAt: 'createdAt' } });

export default mongoose.model('RawSchemaBatch', rawSchemaBatchSchema);