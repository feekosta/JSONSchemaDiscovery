import * as mongoose from 'mongoose';
import {Schema} from 'mongoose';
const rawSchemaOrderedResultSchema = new mongoose.Schema({
	'batchId': {type: mongoose.Schema.Types.ObjectId, ref: 'RawSchemaBatch', required:true},
	'docRawSchema': { type: String, required: true},
	'value': { type: Number, required: true },
	'_id': { type: Schema.Types.Mixed, required: true}
},{ timestamps: { createdAt: 'createdAt' } });
export default rawSchemaOrderedResultSchema;