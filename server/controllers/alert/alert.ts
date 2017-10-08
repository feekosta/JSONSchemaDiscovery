import Alert from '../../models/alert/alert';
import BatchBaseController from '../batchBase';

export default class AlertController extends BatchBaseController {

  model = Alert;

  generate = (rawSchemaBatch): Promise<any> => {
    return new Promise((resolv, reject) => {
      this.model = new Alert({
        "batchId":rawSchemaBatch._id,
        "userId":rawSchemaBatch.userId,
        "status":rawSchemaBatch.status,
        "type":rawSchemaBatch.statusType,
        "dbUri": rawSchemaBatch.dbUri,
        "collectionName": rawSchemaBatch.collectionName,
        "date": new Date()
      });
      this.model.save().then((data) => {
        return resolv(data);
      }).catch((error) => {
        return reject({"type":"ALERT_GENERATE_ERROR", "message": error.message, "code":500});
      });
    });
  }

  listByUserId = (userId): Promise<any> => {
    return new Promise((resolv, reject) => {
      return this.model.find({"userId":userId}).sort("date").then((data) => {
        return resolv(data);
      }, (error) => {
        return reject(error);
      });
    });
  }

  countByUserId = (userId): Promise<any> => {
    return new Promise((resolv, reject) => {
      return this.model.find({"userId":userId}).count().then((data) => {
        return resolv(data);
      }, (error) => {
        return reject(error);
      });
    });
  }

  deleteAlert = (alertId): Promise<any> => {
    return new Promise((resolv, reject) => {
      this.model.findOneAndRemove({ _id: alertId }).then((data) => {
        return resolv(data);
      }, (error) => {
        return reject(error);
      });
    });
  }


}
