import * as mongoose from 'mongoose';
const rawSchemaSchema = new mongoose.Schema({
  'batchId': {type: mongoose.Schema.Types.ObjectId, ref: 'RawSchemaBatch', required:true},
  'docId': { type: String, required: true },
  'docRawSchema': { type: String, required: true }
},{ timestamps: { createdAt: 'createdAt' } });
rawSchemaSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    ret.docRawSchema = JSON.parse(ret.docRawSchema);
    return ret;
  }
});
export default mongoose.model('RawSchema', rawSchemaSchema);