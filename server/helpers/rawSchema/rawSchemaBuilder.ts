import BSONTypeHelper from './bsonTypeHelper';

abstract class RawSchemaBuilder {
  static build = (value) => {
    const bsonType = BSONTypeHelper.getBSONType(value);
    let instance;
    if (bsonType) {
      instance = bsonType;
    } else if (value === undefined) {
      instance = 'Undefined';
    } else if (value === null) {
      instance = 'Null';
    } else if (Array.isArray(value)) {
      instance = [];
      value.forEach((arrayItem) => {
        const arrayItemRawSchema = RawSchemaBuilder.build(arrayItem);
        const rawSchemaAlreadyExists = instance.find(resp => JSON.stringify(resp) === JSON.stringify(arrayItemRawSchema)) != null;
        if (!rawSchemaAlreadyExists) instance.push(arrayItemRawSchema);
      });
    } else if (typeof value === 'object') {
      instance = {};
      Object.keys(value).forEach(property => instance[property] = RawSchemaBuilder.build(value[property]));
    } else {
      instance = value.constructor.name;
    }
    return instance;
  };
}

export default RawSchemaBuilder;
