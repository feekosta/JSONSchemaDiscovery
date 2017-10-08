import * as jwt from 'jsonwebtoken';
import UserController from '../controllers/user/user';
import RawSchemaController from '../controllers/rawSchema/rawSchema';
import RawSchemaBatchController from '../controllers/rawSchema/rawSchemaBatch';
import RawSchemaOrderedResultController from '../controllers/rawSchema/rawSchemaOrderedResult';
import RawSchemaUnionController from '../controllers/rawSchema/rawSchemaUnion';
import JsonSchemaExtractedController from '../controllers/jsonSchema/jsonSchemaExtracted';
import AlertController from '../controllers/alert/alert';

export default class ApiController {

	public login = (req, res) => {
	    return new UserController().login(req.body.email, req.body.password).then((data) => {
	      return this.success(res, data);
	    }, (error) => {
	      return this.error(res, error.message, error.code);
	    });
  	}

  	public getUser = (req, res) => {
  		const user = this.getUserByToken(req);
		if(user && user.user){
		    return new UserController().getUser(user.user._id).then((data) => {
		      return this.success(res, data);
		    }, (error) => {
		      return this.error(res, error.message, error.code);
		    });
		} else {
			return this.error(res, "invalid token", 403);
		}
  	}

  	public listBatchesByUserId = (req, res) => {
  		const user = this.getUserByToken(req);
		if(user && user.user){
			return new RawSchemaBatchController().listByUserId(user.user._id).then((data) => {
				return this.success(res, data);
			}, (error) => {
				return this.error(res, error, 500);
			});
		} else {
			return this.error(res, "invalid token", 403);
		}
  	}

  	public listAlertsByUserId = (req, res) => {
  		const user = this.getUserByToken(req);
		if(user && user.user){
			return new AlertController().listByUserId(user.user._id).then((data) => {
				return this.success(res, data);
			}, (error) => {
				return this.error(res, error, 500);
			});
		} else {
			return this.error(res, "invalid token", 403);
		}
  	}

  	public countAlertsByUserId = (req, res) => {
  		const user = this.getUserByToken(req);
		if(user && user.user){
			return new AlertController().countByUserId(user.user._id).then((data) => {
				return this.success(res, data);
			}, (error) => {
				return this.error(res, error, 500);
			});
		} else {
			return this.error(res, "invalid token", 403);
		}
  	}

  	public deleteAlert = (req, res) => {
  		const user = this.getUserByToken(req);
		if(user && user.user){
			return new AlertController().deleteAlert(req.params.id).then((data) => {
				return this.success(res, data);
			}, (error) => {
				return this.error(res, error, 500);
			});
		} else {
			return this.error(res, "invalid token", 403);
		}
  	}

	public allSteps = (req, res) => {
		const user = this.getUserByToken(req);
		if(user && user.user){
			req.body.userId = user.user._id;
			new RawSchemaBatchController().allSteps(req.body);
		    return this.success(res, "OK");
		} else {
			return this.error(res, "invalid token", 403);
		}
  	}

  	public discovery = (req, res) => {
		new RawSchemaBatchController().discovery(req.body);
	    return this.success(res, "OK");
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

  	public union = (req, res) => {
  		return new RawSchemaOrderedResultController().union(req.body.batchId).then((data) => {
  			return this.success(res, data);
  		}, (error) => {
			return this.error(res, error.message, error.code);
  		});
	}

	public generate = (req, res) => {
  		return new JsonSchemaExtractedController().generate(req.body.batchId).then((data) => {
  			return this.success(res, data);
  		}, (error) => {
			return this.error(res, error.message, error.code);
  		});
	}

	public deleteBatch = (req, res) => {
		return new RawSchemaBatchController().deleteBatch(req.params.id).then((data) => {
  			return this.success(res, data);
  		}, (error) => {
			return this.error(res, error.message, error.code);
  		});
	}

	private error(res, err, code){
		return res.status(code).json({ 'error': err });
	}

	private success(res, obj){
		if(obj == null)
			return res.sendStatus(200);
		return res.status(200).json(obj);
	}

	private getUserByToken(req){
		const authorization = req.headers.authorization;
		if(!authorization)
			return null;
		const bearer = authorization.split("Bearer ");
		if(bearer.length != 2)
			return null;
		const token = bearer[1];
		try {
			return jwt.verify(token, process.env.SECRET_TOKEN);
		} catch(err) {
			return null;
		}
	}
}