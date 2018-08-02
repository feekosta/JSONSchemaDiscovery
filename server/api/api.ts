import UserController from '../controllers/user/user';
import RawSchemaBatchController from '../controllers/rawSchema/rawSchemaBatch';
import RawSchemaOrderedResultController from '../controllers/rawSchema/rawSchemaOrderedResult';
import JsonSchemaExtractedController from '../controllers/jsonSchema/jsonSchemaExtracted';
import AlertController from '../controllers/alert/alert';
import Guard from '../helpers/guard';
import ResultHandler from '../helpers/resultHandler';

export default class ApiController {

  public login = (req, res) => {
    return new UserController().login(req.body.email, req.body.password)
      .then(data => ResultHandler.onSuccess(res, data))
      .catch(error => ResultHandler.onError(res, error));
  };

  public getUser = (req, res) => {
    return Guard.checkToken(req)
      .then(user => new UserController().getUser(user._id))
      .then(data => ResultHandler.onSuccess(res, data))
      .catch(error => ResultHandler.onError(res, error));
  };

  public listBatchesByUserId = (req, res) => {
    return Guard.checkToken(req)
      .then(user => new RawSchemaBatchController().listByUserId(user._id))
      .then(data => ResultHandler.onSuccess(res, data))
      .catch(error => ResultHandler.onError(res, error));
  };

  public listAlertsByUserId = (req, res) => {
    return Guard.checkToken(req)
      .then(user => new AlertController().listByUserId(user._id))
      .then(data => ResultHandler.onSuccess(res, data))
      .catch(error => ResultHandler.onError(res, error));
  };

  public countAlertsByUserId = (req, res) => {
    return Guard.checkToken(req)
      .then(user => new AlertController().countByUserId(user._id))
      .then(data => ResultHandler.onSuccess(res, data))
      .catch(error => ResultHandler.onError(res, error));
  };

  public deleteAlert = (req, res) => {
    return Guard.checkToken(req)
      .then(user => new AlertController().deleteAlert(req.params.id))
      .then(data => ResultHandler.onSuccess(res, data))
      .catch(error => ResultHandler.onError(res, error));
  };

  public allSteps = (req, res) => {
    return Guard.checkToken(req)
      .then(user => {
        req.body.userId = user._id;
        return new RawSchemaBatchController().allSteps(req.body);
      })
      .then(data => ResultHandler.onSuccess(res, data))
      .catch(error => ResultHandler.onError(res, error));
  };

  public discovery = (req, res) => {
    new RawSchemaBatchController().discovery(req.body)
      .then(console.log)
      .catch(console.log);
    return ResultHandler.onSuccess(res, 'OK');
  };

  public aggregate = (req, res) => {
    return new RawSchemaBatchController().aggregate(req.body.batchId)
      .then(data => ResultHandler.onSuccess(res, data))
      .catch(error => ResultHandler.onError(res, error));
  };

  public reduce = (req, res) => {
    return new RawSchemaBatchController().mapReduce(req.body.batchId)
      .then(data => ResultHandler.onSuccess(res, data))
      .catch(error => ResultHandler.onError(res, error));
  };

  public aggregateAndReduce = (req, res) => {
    return new RawSchemaBatchController().aggregateAndReduce(req.body.batchId)
      .then(data => ResultHandler.onSuccess(res, data))
      .catch(error => ResultHandler.onError(res, error));
  };

  public union = (req, res) => {
    return new RawSchemaOrderedResultController(req.body.batchId).union(req.body.batchId)
      .then(data => ResultHandler.onSuccess(res, data))
      .catch(error => ResultHandler.onError(res, error));
  };

  public generate = (req, res) => {
    return new JsonSchemaExtractedController().generate(req.body.batchId)
      .then(data => ResultHandler.onSuccess(res, data))
      .catch(error => ResultHandler.onError(res, error));
  };

  public deleteBatch = (req, res) => {
    return new RawSchemaBatchController().deleteBatch(req.params.id)
      .then(data => ResultHandler.onSuccess(res, data))
      .catch(error => ResultHandler.onError(res, error));
  };
}
