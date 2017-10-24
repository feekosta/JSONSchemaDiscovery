import * as express from 'express';
import UserController from './controllers/user/user';
import RawSchemaBatchController from './controllers/rawSchema/rawSchemaBatch';
import JsonSchemaExtractedController from './controllers/jsonSchema/jsonSchemaExtracted'
import ApiController from "./api/api";

export default function setRoutes(app) {

	const router = express.Router();

	const apiController = new ApiController();

	const userController = new UserController();
	const rawSchemaBatchController = new RawSchemaBatchController();
	const jsonSchemaExtractedController = new JsonSchemaExtractedController();

	router.route('/login').post(apiController.login);
	router.route('/register').post(userController.register);
	router.route('/user').get(apiController.getUser);
	
	router.route('/batch/:id').get(rawSchemaBatchController.get);
	router.route('/batch/:id').delete(apiController.deleteBatch);
	router.route('/batches').get(apiController.listBatchesByUserId);
	
	router.route('/alert/:id').delete(apiController.deleteAlert);
	router.route('/alerts').get(apiController.listAlertsByUserId);
	router.route('/alerts/count').get(apiController.countAlertsByUserId);

	router.route('/batch/rawschema/steps/all').post(apiController.allSteps);
	router.route('/batch/rawschema/discovery').post(apiController.discovery);
	router.route('/batch/rawschema/reduce').post(apiController.reduce);
	router.route('/batch/rawschema/aggregate').post(apiController.aggregate);
	router.route('/batch/rawschema/aggregateAndReduce').post(apiController.aggregateAndReduce);
	router.route('/batch/rawschema/union').post(apiController.union);
	router.route('/batch/jsonschema/generate').post(apiController.generate);
	router.route('/batch/jsonschema/generate/:id').get(jsonSchemaExtractedController.listByBatchId);

	// Apply the routes to our application with the prefix /api
	app.use('/api', router);

}
