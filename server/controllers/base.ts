abstract class BaseController {

  abstract model: any;

  // List all
  public listAll = (req, res) => {
    this.model.find({}, (err, docs) => {
      if (err) {
        return this.error(res, err, 404);
      }
      this.success(res, docs);
    });
  };

  public listAllEntities = (): Promise<any> => {
    return new Promise((resolv, reject) => {
      this.model.find({}).then((data) => {
        return resolv(data);
      }).catch((error) => {
        return reject({'type': 'LIST_ALL_ERROR', 'message': error.message, 'code': 404});
      });
    });
  };

  // Count all
  public count = (req, res) => {
    this.model.count((err, count) => {
      if (err) {
        return this.error(res, err, 404);
      }
      this.success(res, count);
    });
  };

  public countAllEntities = (): Promise<any> => {
    return new Promise((resolv, reject) => {
      this.model.count().then((data) => {
        return resolv(data);
      }).catch((error) => {
        return reject({'type': 'COUNT_ALL_ERROR', 'message': error.message, 'code': 404});
      });
    });
  };

  // Insert
  public insert = (req, res) => {
    const obj = new this.model(req.body);
    obj.save((err, item) => {
      // 11000 is the code for duplicate key error
      if (err && err.code === 11000) {
        this.error(res, err, 400);
      }
      if (err) {
        return this.error(res, err, 404);
      }
      this.success(res, item);
    });
  };

  public insertEntity = (entity): Promise<any> => {
    return new Promise((resolv, reject) => {
      const obj = new this.model(entity);
      obj.save().then((data) => {
        return resolv(data);
      }).catch((error) => {
        // 11000 is the code for duplicate key error
        if (error.code === 11000) {
          return reject({'type': 'DUPLICATE_KEY_ERROR', 'message': error.message, 'code': 400});
        }
        return reject({'type': 'INSERT_ENTITY_ERROR', 'message': error.message, 'code': 400});
      });
    });
  };

  public insertEntities = (entities): Promise<any> => {
    return new Promise((resolv, reject) => {
      this.model.insertMany(entities).then((data) => {
        return resolv(data);
      }).catch((error) => {
        // 11000 is the code for duplicate key error
        if (error.code === 11000) {
          return reject({'type': 'DUPLICATE_KEY_ERROR', 'message': error.message, 'code': 400});
        }
        return reject({'type': 'INSERT_ENTITY_ERROR', 'message': error.message, 'code': 400});
      });
    });
  };

  // Get by id
  public get = (req, res) => {
    this.model.findOne({'_id': req.params.id}, (err, obj) => {
      if (err) {
        return this.error(res, err, 404);
      }
      this.success(res, obj);
    });
  };

  public getEntity = (id): Promise<any> => {
    return new Promise((resolv, reject) => {
      this.model.findOne({'_id': id}).then((data) => {
        return resolv(data);
      }).catch((error) => {
        return reject({'type': 'GET_ENTITY_ERROR', 'message': error.message, 'code': 404});
      });
    });
  };

  // Update by id
  public update = (req, res) => {
    this.model.findOneAndUpdate({'_id': req.params.id}, {$inc: {__v: 1}}, req.body, (err) => {
      if (err) {
        return this.error(res, err, 404);
      }
      this.success(res, null);
    });
  };

  public updateEntity = (id, entity): Promise<any> => {
    return new Promise((resolv, reject) => {
      this.model.findOneAndUpdate({'_id': id}, {$inc: {__v: 1}}, entity).then((data) => {
        return resolv(data);
      }).catch((error) => {
        return reject({'type': 'UPDATE_ENTITY_ERROR', 'message': error.message, 'code': 404});
      });
    });
  };

  // Delete by id
  public delete = (req, res) => {
    this.model.findOneAndRemove({_id: req.params.id}, (err) => {
      if (err) {
        return this.error(res, err, 404);
      }
      this.success(res, null);
    });
  };

  public deleteEntity = (id): Promise<any> => {
    return new Promise((resolv, reject) => {
      this.model.findOneAndRemove({_id: id}).then((data) => {
        return resolv(data);
      }).catch((error) => {
        return reject({'type': 'DELETE_ENTITY_ERROR', 'message': error.message, 'code': 404});
      });
    });
  };

  public deleteAll = (): Promise<any> => {
    return new Promise((resolv, reject) => {
      this.model.remove({}).then((data) => {
        return resolv(data);
      }).catch((error) => {
        return reject({'type': 'REMOVE_ALL_ERROR', 'message': error.message, 'code': 404});
      });
    });
  };

  public error(res, err, code) {
    return res.status(code).json({'error': err});
  }

  public success(res, obj) {
    if (obj)
      return res.status(200).json(obj);
    return res.sendStatus(200);
  }

}

export default BaseController;
