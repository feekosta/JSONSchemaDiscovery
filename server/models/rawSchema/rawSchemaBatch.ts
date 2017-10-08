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
  'statusType': { type: String },
  
  'reduceType': { type: String },
  
  'startDate': { type: Date },
  
  'extractionDate': { type: Date },
  'extractionElapsedTime': { type: Number },

  'unorderedMapReduceDate': {type:Date},
  'unorderedMapReduceElapsedTime': {type:Number},

  'orderedMapReduceDate': {type:Date},
  'orderedMapReduceElapsedTime': {type:Number},

  'unorderedAggregationDate': {type:Date},
  'unorderedAggregationElapsedTime': {type:Number},

  'orderedAggregationDate': {type:Date},
  'orderedAggregationElapsedTime': {type:Number},

  'unionDate': {type:Date},
  'unionElapsedTime': {type:Number},

  'endDate': { type: Date },
  'totalElapsedTime': { type: Number }

},{ timestamps: { createdAt: 'createdAt' } });

export default mongoose.model('RawSchemaBatch', rawSchemaBatchSchema);