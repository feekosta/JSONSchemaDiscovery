import UserController from '../controllers/user/user';
import RawSchemaController 				from '../controllers/rawSchema/rawSchema';
import RawSchemaBatchController 		from '../controllers/rawSchema/rawSchemaBatch';
import RawSchemaOrderedResultController from '../controllers/rawSchema/rawSchemaOrderedResult';
import RawSchemaUnionController 		from '../controllers/rawSchema/rawSchemaUnion';
import JsonSchemaExtractedController 	from '../controllers/jsonSchema/jsonSchemaExtracted'

export default class ApiController {

	public login = (req, res) => {
	    return new UserController().login(req.body.email, req.body.password).then((data) => {
	      return this.success(res, data);
	    }, (error) => {
	      return this.error(res, error.message, error.code);
	    });
  	}

  	public discovery = (req, res) => {
  		return new RawSchemaBatchController().discovery(req.body).then((data) => {
	      return this.success(res, data);
	    }, (error) => {
	      return this.error(res, error.message, error.code);
	    });
  	}

	public aggregate = (req, res) => {
  		return new RawSchemaBatchController().aggregate(req.body.batchId).then((data) => {
	      return this.success(res, data);
	    }, (error) => {
	      return this.error(res, error.message, error.code);
	    });
  	}

  	public reduce = (req, res) => {
  		return new RawSchemaBatchController().mapReduce(req.body.batchId).then((data) => {
	      return this.success(res, data);
	    }, (error) => {
	      return this.error(res, error.message, error.code);
	    });
  	}

  	public aggregateAndReduce = (req, res) => {
  		return new RawSchemaBatchController().aggregateAndReduce(req.body.batchId).then((data) => {
	      return this.success(res, data);
	    }, (error) => {
	      return this.error(res, error.message, error.code);
	    });
  	}

	private error(res, err, code){
		return res.status(code).json({ 'error': err });
	}

	private success(res, obj){
		if(obj) 
			return res.status(200).json(obj);
		return res.sendStatus(200);
	}
}