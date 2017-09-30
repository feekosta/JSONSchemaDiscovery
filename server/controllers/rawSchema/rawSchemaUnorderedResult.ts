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

	saveResults = (mapReduceResults, batchId): Promise<any> => {
		return new Promise((resolv, reject) => {
			this.deleteEntitiesByBatchId(batchId).then((data) => {
				const rawSchemaUnorderedResults = this.buildRawSchemaUnorderedResults(mapReduceResults, batchId);
				this.model.insertMany(rawSchemaUnorderedResults, { ordered: true }).then((data) => {
					return resolv(data);
				}, (error) => {
					return reject(error);
				});
			}, (error) => {
				return reject(error);
			});
		});
	}

	private buildRawSchemaUnorderedResults = (results, batchId) => {
		const rawSchemaUnorderedResults = [];
		results.forEach((result) => {
			const rawSchemaUnorderedResult = this.model({
				"batchId": batchId,
				"docRawSchema": result._id,
				"value": result.value,
				"_id": result._id
			});
			rawSchemaUnorderedResults.push(rawSchemaUnorderedResult);
		});
		return rawSchemaUnorderedResults;
	}

	mapReduce = (batchId): Promise<any> => {
		return new Promise((resolv, reject) => {
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
		      if (mapReduceError)
		      	return reject(mapReduceError);
		      return resolv(mapReduceResult);
		    });
		});
  	}

	aggregate = (batchId): Promise<any> => {
		return new Promise((resolv, reject) => {
			const collectionToWork = this.model.find({});
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
						if (aggregateError)
							return reject(aggregateError);
						return resolv(aggregateResult);
					});
			});
			order.on('error',(error) => {
				reject(error);
			});

		});
		
	}

}
