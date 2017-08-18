abstract class BaseController {

  abstract model: any;

  // List all
  public listAll = (req, res) => {
    this.model.find({}, (err, docs) => {
      if (err) { return this.error(res, err, 404); }
      this.success(res, docs);
    });
  }

  // Count all
  public count = (req, res) => {
    console.log("cooooooooooount");
    this.model.count((err, count) => {
      console.log("eeeeeeeeeerrr",err);
      if (err) { return this.error(res, err, 404); }
      this.success(res, count);
    });
  }

  // Insert
  public insert = (req, res) => {
    const obj = new this.model(req.body);
    obj.save((err, item) => {
      // 11000 is the code for duplicate key error
      if (err && err.code === 11000) { this.error(res, err, 400); }
      if (err) { return this.error(res, err, 404); }
      this.success(res, item);
    });
  }

  // Get by id
  public get = (req, res) => {
    this.model.findOne({ '_id': req.params.id }, (err, obj) => {
      if (err) { return this.error(res, err, 404); }
      this.success(res, obj);
    });
  }

  // Update by id
  public update = (req, res) => {
    this.model.findOneAndUpdate({ '_id': req.params.id }, {$inc: { __v: 1 } }, req.body, (err) => {
      if (err) { return this.error(res, err, 404); }
      this.success(res, null);
    });
  }

  // Delete by id
  public delete = (req, res) => {
    this.model.findOneAndRemove({ _id: req.params.id }, (err) => {
      if (err) { return this.error(res, err, 404); }
      this.success(res, null);
    });
  }

  public error(res, err, code){
    return res.status(code).json({ 'error': err });
  }

  public success(res, obj){
    if(obj)
      return res.status(200).json(obj);
    return res.sendStatus(200);
  }

}

export default BaseController;
