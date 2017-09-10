import * as mongoose from 'mongoose';
const rawSchemaOrderedResultSchema = new mongoose.Schema({
  'batchId': {type: mongoose.Schema.Types.ObjectId, ref: 'RawSchemaBatch', required:true},
  'rawSchema': { type: String, required: true },
  'count': { type: String, required: true }
},{ timestamps: { createdAt: 'createdAt' } });
rawSchemaOrderedResultSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    ret.rawSchema = JSON.parse(ret.rawSchema);
    return ret;
  }
});
export default mongoose.model('RawSchemaOrderedResult', rawSchemaOrderedResultSchema);