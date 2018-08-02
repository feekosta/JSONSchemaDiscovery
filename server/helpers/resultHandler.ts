export default class ResultHandler {

  public static onSuccess(res, data) {
    return data != null ? res.status(200).json(data) : res.sendStatus(200);
  }

  public static onError(res, error) {
    return res.status(error.code).json({'error': error.message});
  }

}
