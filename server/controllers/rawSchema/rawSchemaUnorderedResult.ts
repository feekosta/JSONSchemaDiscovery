import * as mongoose 					from 'mongoose';
import {ObjectId}          				from 'mongodb';
import rawSchemaUnorderedResultSchema 	from '../../models/rawSchema/rawSchemaUnorderedResult';
import BatchBaseController  			from '../batchBase';
import ObjectKeysSorter 				from '../../helpers/objectKeysSorter';
import rawSchemaOrder					from '../../helpers/rawSchema/rawSchemaOrder';
import options 							from '../../params/mapReduceParam';

declare var emit;
declare var sort;
declare var docRawSchema;

export default class RawSchemaUnorderedResultController extends BatchBaseController {
  
  	model = null;

	constructor(batchId: String) {
		super();
		const rawSchemaUnorderedResultCollectionName = `rawSchemaUnordered${batchId}Result`;
	 	const RawSchemaUnorderedResult = mongoose.model(rawSchemaUnorderedResultCollectionName, rawSchemaUnorderedResultSchema);
	 	this.model = RawSchemaUnorderedResult;
	}

	saveResults = (mapReduceResults, batchId, callback) => {
		this.deleteEntitiesByBatchId(batchId).then((data) => {
			const rawSchemaUnorderedResults = [];
			mapReduceResults.forEach((result) => {
				let rawSchemaUnorderedResult = this.model();
				rawSchemaUnorderedResult.batchId = batchId;
				rawSchemaUnorderedResult.docRawSchema = result._id;
				rawSchemaUnorderedResult.value = result.value;
				rawSchemaUnorderedResult._id = result._id;
				rawSchemaUnorderedResults.push(rawSchemaUnorderedResult);
			});
			this.model.insertMany(rawSchemaUnorderedResults, { ordered: true }, (error, res) => {
				callback(null, "OK");	
			});
		}, (error) => {
			
		});
	}

	mapReduce = (batchId, callback) => {
	    const sort = new ObjectKeysSorter().sort;
	    const sortObject = new ObjectKeysSorter().sortObject;
	    options.map = function() {
	    	const unorderedObject = JSON.parse(this.docRawSchema);
	    	const orderedObject = sort(unorderedObject);
	      	emit(JSON.stringify(orderedObject), this.value); 
	    };
	    options.reduce = function(key, values) { 
	      let count = 0;
	      values.forEach((value) => {
	        count += value;
	      });
	      return count;
	    };
	    options.scope = { 'sort': sort, 'sortObject': sortObject }
	 	this.model.mapReduce(options, (mapReduceError, mapReduceResult) => {
	      if (mapReduceError) { return callback(mapReduceError, null); }
	      callback(null, mapReduceResult);
	    });
  	}

	aggregate = (batchId, callback) => {
		const collectionToWork = this.model.find({}).limit(40000);
		const order = collectionToWork.cursor().pipe(rawSchemaOrder());
		order.on('progress', (data) => {
			this.model.update(
				{ _id: data._id },
				{ $set: { 'docRawSchema': data.docRawSchema } }
			);
		});
		order.on('end', () => {
			this.model.aggregate([
				{ $match: { batchId:ObjectId(batchId) } },
				{ $project: { batchId: 1 , docRawSchema: 1, value:1 } },
				{ $group: { _id:"$docRawSchema", value:{$sum:1}, batchId: { $last: "$batchId" }, docRawSchema: { $last: "$docRawSchema" } } },
				]).allowDiskUse(true).exec((aggregateError, aggregateResult) => {
					if (aggregateError) { return callback(aggregateError, null); }
					callback(null, aggregateResult);
				});
		});
		order.on('error',(error) => {
			callback(error, null);
		});
	}

}
