import * as express from 'express';

import UserController from './controllers/user';
import RawSchemaController from './controllers/rawSchema';
import RawSchemaBatchController from './controllers/rawSchemaBatch';
import RawSchemaResultController from './controllers/rawSchemaResult';
import RawSchemaUnionController from './controllers/rawSchemaUnion';

export default function setRoutes(app) {

	const router = express.Router();

	const userController = new UserController();

	const rawSchemaController = new RawSchemaController();
	const rawSchemaBatchController = new RawSchemaBatchController();
	const rawSchemaResultController = new RawSchemaResultController();
	const rawSchemaUnionController = new RawSchemaUnionController();

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
	router.route('/batch/rawschema/reduce/count').get(rawSchemaBatchController.count);
	router.route('/batch/rawschema/reduce/:id').get(rawSchemaResultController.listByBatchId);
	router.route('/batch/rawschema/reduce/:id').delete(rawSchemaResultController.deleteByBatchId);
	router.route('/batch/rawschema/reduce/:id/count').get(rawSchemaResultController.countByBatchId);

	router.route('/batch/rawschema/union/hashmap').post(rawSchemaResultController.hashMapUnion);
	router.route('/batch/rawschema/union/hashmap/count').get(rawSchemaUnionController.hasMapUnionCount);
	router.route('/batch/rawschema/union/hashmap/:id').get(rawSchemaUnionController.hasMapUnionListByBatchId);
	router.route('/batch/rawschema/union/hashmap/:id/final').get(rawSchemaUnionController.finalRawSchemaListByBatchId);
	router.route('/batch/rawschema/union/hashmap/:id').delete(rawSchemaUnionController.hasMapUnionDeleteByBatchId);


	// Apply the routes to our application with the prefix /api
	app.use('/api', router);

}