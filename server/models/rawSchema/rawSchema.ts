import * as mongoose from 'mongoose';
import {Schema} from 'mongoose';
const rawSchemaSchema = new mongoose.Schema({
	'batchId': {type: mongoose.Schema.Types.ObjectId, ref: 'RawSchemaBatch', required:true},
	'docRawSchema': { type: String, required: true},
	'docId': { type: String, required: true }
},{ timestamps: { createdAt: 'createdAt' } });
export default rawSchemaSchema;