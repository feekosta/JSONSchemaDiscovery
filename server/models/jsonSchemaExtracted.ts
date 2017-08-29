import * as mongoose from 'mongoose';

const jsonSchemaExtractedSchema = new mongoose.Schema({
  'rawSchemaBatchId': { type: mongoose.Schema.Types.ObjectId, ref: 'RawSchemaBatch', required:true },
  'jsonSchema': { type: String, required:true }
},{ timestamps: { createdAt: 'createdAt' } });

jsonSchemaExtractedSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    ret.jsonSchema = JSON.parse(ret.jsonSchema);
    return ret;
  }
});

const JsonSchemaExtracted = mongoose.model('JsonSchemaExtracted', jsonSchemaExtractedSchema);

export default JsonSchemaExtracted;