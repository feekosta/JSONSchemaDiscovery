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
declare var print;

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
		    	let unorderedObject;
		    	if(this.docRawSchema != null){
		    		unorderedObject = JSON.parse(this.docRawSchema);
		    	} else {
		    		unorderedObject = JSON.parse(this._id);
		    	}
		    	const orderedObject = sort(unorderedObject);
		    	let orderedObjectJson = JSON.stringify(orderedObject);
		    	print("MAP");
		    	print(orderedObjectJson);
		    	print(orderedObjectJson.length);
	      		emit(orderedObjectJson, this.value); 
		    };
		    options.reduce = function(key, values) { 
		      let count = 0;
		      print("REDUCE");
		      print(values);
		      print(key);
		      values.forEach((value) => {
		        count += value;
		      });
		      return count;
		    };
		    options.scope = { 'sort': sort, 'sortObject': sortObject }
		 	this.model.mapReduce(options).then((data) => {
		 		console.log("data",data);
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
			let quantity = -1;
			let updateQuantity = 0;
			collectionToWork.count().then((data) => {
				quantity = data;
			})
			const order = collectionToWork.cursor().pipe(rawSchemaOrder());
			order.on('progress', (data) => {
				this.model.update(
					{ _id: data._id },
					{ "$set":{'docRawSchema': data.docRawSchema} }
				).then((data) => {
					updateQuantity++;
					if(quantity >= 0 && updateQuantity >= quantity){
						this.executeAggregation(batchId).then((data) => {
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
			order.on('ignore', () => {
				console.log("ignore");
				updateQuantity++;
				if(quantity >= 0 && updateQuantity >= quantity){
					this.executeAggregation(batchId).then((data) => {
						return resolv(data);
					}).catch((error) => {
						console.error("error",error);
						return reject(error);
					});
				}
			});
			order.on('error',(error) => {
				console.error("error",error);
				reject(error);
			});
		});
	}

	executeAggregation = (batchId): Promise<any> => {
		return new Promise((resolv, reject) => {
			this.model.aggregate([
				{ $project: { docRawSchema: 1, value:1 } },
				{ $group: { _id:"$docRawSchema", value:{$sum:"$value"} } },
				{ $out: `rawschemaordered${batchId}results` }
				]).allowDiskUse(true).exec().then((data) => {
					return resolv(data);
				}).catch((error) => {
					console.error("error",error);
					return reject(error);
				});
		});
	}

}
