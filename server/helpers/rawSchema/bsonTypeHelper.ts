export default abstract class BSONTypeHelper {

  static getBSONType(data) {
    if (data !== null && data !== undefined) {
      if (data.$regex && data.$options) {
        return 'RegExp';
      } else if (data.$symbol) {
        return 'Symbol';
      } else if (data.$numberInt) {
        return 'NumberInt';
      } else if (data.$numberLong) {
        return 'NumberLong';
      } else if (data.$numberDouble) {
        return 'NumberDouble';
      } else if (data.$numberDecimal) {
        return 'Decimal128';
      } else if (data._bsontype != null) {
        return data._bsontype;
      } else if (data.constructor.name === 'Date') {
        return data.constructor.name;
      } else if (data.constructor.name === 'RegExp') {
        return data.constructor.name;
      }
    }
  }

}
