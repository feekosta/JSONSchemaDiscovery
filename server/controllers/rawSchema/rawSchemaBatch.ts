import * as co                            from 'co';
import * as mongodb                       from 'mongodb';
import {MongoClient}                      from 'mongodb'
import RawSchemaBatch                     from '../../models/rawSchema/rawSchemaBatch';
import RawSchemaProcessWorker             from '../../helpers/rawSchema/rawSchemaProcessWorker';
import DatabaseParam                      from '../../params/databaseParam';
import BaseController                     from '../base';
import RawSchemaController                from './rawSchema';
import RawSchemaOrderedResultController   from './rawSchemaOrderedResult';
import RawSchemaUnorderedResultController from './rawSchemaUnorderedResult';

export default class RawSchemaBatchController extends BaseController {
  
  model = RawSchemaBatch;

  discovery = (req, res) => {
    const databaseParam = new DatabaseParam(JSON.parse(JSON.stringify(req.body)));
    const rawSchemaBatch = new this.model();
    rawSchemaBatch.collectionName = databaseParam.collectionName;
    rawSchemaBatch.dbUri = databaseParam.getURIWithoutAuthentication();
    rawSchemaBatch.userId = databaseParam.userId;
    rawSchemaBatch.startDate = new Date();
    this.getDatabaseConnection(res, databaseParam, (connectionError, database) => {
      if(connectionError){ return this.error(res, connectionError, 400)};
      this.success(res, rawSchemaBatch._id);
      const collection = database.collection(databaseParam.collectionName);
      this.setCollectionSize(res, collection, rawSchemaBatch);
      const worker = new RawSchemaProcessWorker();
      const saver = new RawSchemaController();
      worker.work(rawSchemaBatch, collection, null)
        .on('done',() => {
          rawSchemaBatch.status = "DONE";
          rawSchemaBatch.endDate = new Date();
          rawSchemaBatch.elapsedTime = Math.abs((rawSchemaBatch.startDate.getTime() - rawSchemaBatch.endDate.getTime())/1000);
          console.log("BATCHQUERY",rawSchemaBatch._id," DONE IN: ",rawSchemaBatch.elapsedTime);
          rawSchemaBatch.save();
        })
        .on('error', (error) => {
          rawSchemaBatch.status = "ERROR";
          rawSchemaBatch.statusMessage = error;
          console.log("BATCHQUERY",rawSchemaBatch._id," ERROR: ",error);
          rawSchemaBatch.save();
        })
        .on('lastObjectId', (lastObjectId) => {
          worker.work(rawSchemaBatch, collection, lastObjectId);
        })
        .on('save', (rawSchemes) => {
          saver.saveAll(rawSchemes, rawSchemaBatch._id);
        });
    });
  }

  getDatabaseConnection = (res, databaseParam, callback) => {
    return co(function*() {
      const url = databaseParam.getURI();
      const database = yield MongoClient.connect(url);
      return database;
    }).then((resp) => {
      return callback(null, resp);
    }).catch((err) => {
      return callback(err, null);
    });
  }

  setCollectionSize = (res, collection, rawSchemaBatch) => {
    return co(function*() {
      const count = yield collection.count();
      return count;
    }).then((resp) => {
      rawSchemaBatch.collectionCount = resp;
      rawSchemaBatch.status = "IN_PROGRESS";
      rawSchemaBatch.save();
    }).catch((err) => {});
  }

  reduce = (req, res) => {
    this.getById(req.body.batchId).then((rawSchemaBatchResult) => {
      if (!rawSchemaBatchResult) { return this.error(res, `rawSchemaBatch with id: ${req.body.batchId} not found`, 404); }
      const batchId = rawSchemaBatchResult._id;
      new RawSchemaController().mapReduce(batchId).then((data) => {
        new RawSchemaUnorderedResultController(batchId).saveResults(data, batchId).then((data) => {
          new RawSchemaUnorderedResultController(batchId).mapReduce(batchId).then((data) => {
            new RawSchemaOrderedResultController().saveResults(data, batchId).then((data) => {
              return this.success(res, data);
            }, (error) => {
              return this.error(res, error, 500);
            });
          }, (error) => {
            return this.error(res, error, 500);
          }); 
        }, (error) => {
          return this.error(res, error, 500);
        });
      }, (error) => {
        return this.error(res, error, 500);
      });
    }, (error) => {
      return this.error(res, error, 500);
    });
  }

  aggregate = (req, res) => {
    this.getById(req.body.batchId).then((rawSchemaBatchResult) => {
      if (!rawSchemaBatchResult) { return this.error(res, `rawSchemaBatch with id: ${req.body.batchId} not found`, 404); }
      const batchId = rawSchemaBatchResult._id;
      new RawSchemaController().aggregate(batchId).then((data) => {
        new RawSchemaUnorderedResultController(batchId).aggregate(batchId).then((data) => {
          new RawSchemaOrderedResultController().saveResults(data, batchId).then((data) => {
            return this.success(res, data);
          }, (error) => {
            return this.error(res, error, 500);
          });
        }, (error) => {
          return this.error(res, error, 500);
        });
      }, (error) => {
        return this.error(res, error, 500);
      });
    }, (error) => {
      return this.error(res, error, 500);
    });
  }

  aggregateAndReduce = (req, res) => {
    this.getById(req.body.batchId).then((rawSchemaBatchResult) => {
      if (!rawSchemaBatchResult) { return this.error(res, `rawSchemaBatch with id: ${req.body.batchId} not found`, 404); }
      const batchId = rawSchemaBatchResult._id;
      new RawSchemaController().aggregate(batchId).then((data) => {
        new RawSchemaUnorderedResultController(batchId).mapReduce(batchId).then((data) => {
          new RawSchemaOrderedResultController().saveResults(data, batchId).then((data) => {
            return this.success(res, data);
            }, (error) => {
            return this.error(res, error, 500);
          });
        }, (error) => {
          return this.error(res, error, 500);
        });
      }, (error) => {
        return this.error(res, error, 500);
      });
    }, (error) => {
      return this.error(res, error, 500);
    });
  }

  getById = (id) => {
  	return this.model.findById(id);
  }
 
}
