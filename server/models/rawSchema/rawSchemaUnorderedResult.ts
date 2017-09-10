import * as mongoose from 'mongoose';
import {Schema} from 'mongoose';
const rawSchemaUnorderedResultSchema = new mongoose.Schema({
  	'batchId': {type: mongoose.Schema.Types.ObjectId, ref: 'RawSchemaBatch', required:true},
  	'docRawSchema': { type: String, required: true},
  	'value': { type: Number, required: true },
  	'_id': { type: Schema.Types.Mixed, required: true}
});
rawSchemaUnorderedResultSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    ret.docRawSchema = JSON.parse(ret.docRawSchema);
    return ret;
  }
});
export default rawSchemaUnorderedResultSchema;