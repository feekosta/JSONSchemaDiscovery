import * as express 					from 'express';
import UserController 					from './controllers/user/user';
import RawSchemaController 				from './controllers/rawSchema/rawSchema';
import RawSchemaBatchController 		from './controllers/rawSchema/rawSchemaBatch';
import RawSchemaOrderedResultController from './controllers/rawSchema/rawSchemaOrderedResult';
import RawSchemaUnionController 		from './controllers/rawSchema/rawSchemaUnion';
import JsonSchemaExtractedController 	from './controllers/jsonSchema/jsonSchemaExtracted'

export default function setRoutes(app) {

	const router = express.Router();

	const userController = new UserController();

	const rawSchemaController = new RawSchemaController();
	const rawSchemaBatchController = new RawSchemaBatchController();
	const rawSchemaOrderedResultController = new RawSchemaOrderedResultController();
	const rawSchemaUnionController = new RawSchemaUnionController();

	const jsonSchemaExtractedController = new JsonSchemaExtractedController();

	router.route('/login').post(userController.login);
	router.route('/register').post(userController.register);

	router.route('/users').get(userController.listAll);
	router.route('/users/count').get(userController.count);
	router.route('/user').post(userController.insert);
	router.route('/user/:id').get(userController.get);
	router.route('/user/:id').put(userController.update);
	router.route('/user/:id').delete(userController.delete);

	router.route('/batch/:id').get(rawSchemaBatchController.get);
	router.route('/batch/:id').delete(rawSchemaBatchController.delete);

	router.route('/batch/rawschema/discovery').post(rawSchemaBatchController.discovery);
	router.route('/batch/rawschema/discovery/count').get(rawSchemaController.count);
	router.route('/batch/rawschema/discovery/:id').get(rawSchemaController.listByBatchId);
	router.route('/batch/rawschema/discovery/:id').delete(rawSchemaController.deleteByBatchId);
	router.route('/batch/rawschema/discovery/:id/count').get(rawSchemaController.countByBatchId);

	router.route('/batch/rawschema/reduce').post(rawSchemaBatchController.reduce);
	router.route('/batch/rawschema/reduce/count').get(rawSchemaOrderedResultController.count);
	router.route('/batch/rawschema/reduce/:id').get(rawSchemaOrderedResultController.listByBatchId);
	router.route('/batch/rawschema/reduce/:id').delete(rawSchemaOrderedResultController.deleteByBatchId);
	router.route('/batch/rawschema/reduce/:id/count').get(rawSchemaOrderedResultController.countByBatchId);

	router.route('/batch/rawschema/aggregate').post(rawSchemaBatchController.aggregate);
	router.route('/batch/rawschema/aggregate/count').get(rawSchemaOrderedResultController.count);
	router.route('/batch/rawschema/aggregate/:id').get(rawSchemaOrderedResultController.listByBatchId);
	router.route('/batch/rawschema/aggregate/:id').delete(rawSchemaOrderedResultController.deleteByBatchId);
	router.route('/batch/rawschema/aggregate/:id/count').get(rawSchemaOrderedResultController.countByBatchId);

	router.route('/batch/rawschema/aggregateAndReduce').post(rawSchemaBatchController.aggregateAndReduce);
	router.route('/batch/rawschema/aggregateAndReduce/count').get(rawSchemaOrderedResultController.count);
	router.route('/batch/rawschema/aggregateAndReduce/:id').get(rawSchemaOrderedResultController.listByBatchId);
	router.route('/batch/rawschema/aggregateAndReduce/:id').delete(rawSchemaOrderedResultController.deleteByBatchId);
	router.route('/batch/rawschema/aggregateAndReduce/:id/count').get(rawSchemaOrderedResultController.countByBatchId);
	
	router.route('/batch/rawschema/union').post(rawSchemaOrderedResultController.union);
	router.route('/batch/rawschema/union/count').get(rawSchemaUnionController.count);
	router.route('/batch/rawschema/union/:id').get(rawSchemaUnionController.listByBatchId);
	router.route('/batch/rawschema/union/:id').delete(rawSchemaUnionController.deleteByBatchId);
	router.route('/batch/rawschema/union/:id/count').get(rawSchemaUnionController.countByBatchId);

	router.route('/batch/jsonschema/generate').post(jsonSchemaExtractedController.generate);
	router.route('/batch/jsonschema/generate/count').get(jsonSchemaExtractedController.count);
	router.route('/batch/jsonschema/generate/:id').get(jsonSchemaExtractedController.listByBatchId);
	router.route('/batch/jsonschema/generate/:id').delete(jsonSchemaExtractedController.deleteByBatchId);

	// Apply the routes to our application with the prefix /api
	app.use('/api', router);

}
