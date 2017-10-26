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

	mapReduce = (batchId): Promise<any> => {
		return new Promise((resolv, reject) => {
			const sort = new ObjectKeysSorter().sort;
		    const sortObject = new ObjectKeysSorter().sortObject;
		    options.out = { 'replace':`rawschemaordered${batchId}results` };
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
		 	this.model.mapReduce(options).then((data) => {
				return resolv(data);
		 	}).catch((error) => {
		 		console.error("error",error);
				return reject(error);
		    });
		});
  	}

	aggregate = (batchId): Promise<any> => {
		return new Promise((resolv, reject) => {
			const collectionToWork = this.model.find({});
			const order = collectionToWork.cursor().pipe(rawSchemaOrder());
			let quantity = -1;
			let updateQuantity = 0;
			collectionToWork.count().then((data) => {
				quantity = data;
			})
			order.on('progress', (data) => {
				this.model.update(
					{ _id: data._id },
					{ $set: { 'docRawSchema': data.docRawSchema } }
				).then((data) => {
					updateQuantity++;
					if(quantity >= 0 && updateQuantity >= quantity){
						this.model.aggregate([
							{ $project: { batchId: 1 , docRawSchema: 1, value:1 } },
							{ $group: { _id:"$docRawSchema", value:{$sum:"$value"}, batchId: { $last: "$batchId" }, docRawSchema: { $last: "$docRawSchema" } } },
							{ $out: `rawschemaordered${batchId}results` }
							]).allowDiskUse(true).exec().then((data) => {
								return resolv(data);
							}).catch((error) => {
								console.error("error",error);
								return reject(error);
							});
					}
				}).catch((error) => {
					console.error("error",error);
					return reject(error);
				});
			});
			order.on('error',(error) => {
				reject(error);
			});

		});
		
	}

}
