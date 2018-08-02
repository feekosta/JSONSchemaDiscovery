export default abstract class BSONTypeHelper {

  static getBSONType(data) {
    if (data !== null && data !== undefined) {
      if (data._bsontype != null) {
        return data._bsontype;
      } else if (data.constructor.name === 'Date') {
        return data.constructor.name;
      } else if (data.constructor.name === 'RegExp') {
        return data.constructor.name;
      }
    }
  }

}
