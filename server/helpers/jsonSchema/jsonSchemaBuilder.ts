import JSONSchema from './jsonSchema';

export default class JsonSchemaBuilder {

  rootSchema = new JSONSchema();
  usedDefinitions = [];

  build = (fields, count) => {
    this.rootSchema.properties = this.getFieldsSchema(fields);
    this.rootSchema.required = [];
    Object.keys(this.rootSchema.properties).forEach((property) => {
      if (this.rootSchema.properties[property].count === count) this.rootSchema.required.push(property);
      delete this.rootSchema.properties[property].count;
    });
    this.removeUnusedDefinitions();
    return this.rootSchema;
  };

  private getFieldsSchema = (fields) => {
    const properties = {};
    fields.forEach(field => properties[field.name] = this.getSchemaFromValue(field));
    return properties;
  };

  private getSchemaFromValue = (value) => {
    let schema;
    if (value.types) {
      schema = this.getFieldSchema(value);
    } else {
      if (this.isBSON(value)) {
        schema = this.getExtendedTypeSchema(value);
      } else if (this.isPrimitive(value)) {
        schema = this.getPrimitiveTypeSchema(null, value.name, value.count);
      } else if (value.name === 'Array') {
        schema = this.getArrayTypeSchema(value);
      } else {
        schema = this.getObjectTypeSchema(value);
      }
    }
    return schema;
  };

  private getFieldSchema = (field) => {
    let schema;
    if (field.types.length === 1) {
      const type = field.types[0];
      if (this.isBSON(type)) {
        schema = this.getExtendedTypeSchema(type);
      } else if (this.isPrimitive(type)) {
        schema = this.getPrimitiveTypeSchema(field.name, type.name, field.count);
      } else if (type.name === 'Array') {
        schema = this.getSchemaFromValue(type);
      } else {
        schema = this.getSchemaFromValue(type);
        schema.name = type.path;
      }
    } else {
      schema = {
        'name': field.name,
        'anyOf': this.buildItems(field.types),
        'count': field.count
      };
      schema.anyOf.forEach(item => delete item.count);
    }
    return schema;
  };

  private getExtendedTypeSchema = (type) => {
    this.addToUsedDefinitions(type.name);
    const schema = {
      '$ref': `#/definitions/${type.name}`,
      'count': type.count
    };
    return schema;
  };

  private getPrimitiveTypeSchema = (name, type, count) => {
    let schema;
    if (name) {
      schema = {
        'name': name,
        'type': type.toLowerCase(),
        'count': count
      };
    } else {
      schema = {
        'type': type.toLowerCase(),
        'count': count
      };
    }
    return schema;
  };

  private getObjectTypeSchema = (object) => {
    const schema = {
      'type': 'object',
      'properties': this.getFieldsSchema(object.fields),
      'count': object.count,
      'additionalProperties': false,
      'required': []
    };
    Object.keys(schema.properties).forEach(property => {
      if (schema.properties[property].count === object.count) schema.required.push(property);
      delete schema.properties[property].count;
    });
    return schema;
  };

  private getArrayTypeSchema = (array) => {
    let items, totalCount;
    const itemsArray = this.buildItems(array.items);
    if (itemsArray.length === 1) {
      items = itemsArray.pop();
      totalCount = items.count;
      delete items.count;
    } else {
      items = {'anyOf': itemsArray};
      totalCount = itemsArray.map(item => item.count).reduce((preVal, elem) => preVal + elem, 0);
      itemsArray.forEach(item => delete item.count);
    }
    const schema = {
      'name': array.path,
      'type': array.name.toLowerCase(),
      'items': items,
      'minItems': 0,
      'count': array.count,
      'additionalItems': true
    };
    if (totalCount >= array.count) schema.minItems = 1;
    return schema;
  };

  private buildItems = values => {
    return values.map(this.getSchemaFromValue);
  };

  private addToUsedDefinitions = bsonType => {
    if (this.usedDefinitions.indexOf(bsonType) < 0) this.usedDefinitions.push(bsonType);
  };

  private isBSON = value => {
    switch (value.name) {
      case 'Boolean':
      case 'Null':
      case 'String':
      case 'Number':
      case 'Array':
      case 'Object':
      case 'Integer':
        return false;
      default:
        return true;
    }
  };

  private isPrimitive = value => {
    switch (value.name) {
      case 'Boolean':
      case 'Null':
      case 'String':
      case 'Number':
      case 'Integer':
        return true;
      default:
        return false;
    }
  };

  private removeUnusedDefinitions = () => {
    Object.keys(this.rootSchema.definitions).forEach(definition => {
      const definitionUsed = this.usedDefinitions.find(bsonType => bsonType === definition) != null;
      if (!definitionUsed) delete this.rootSchema.definitions[definition];
    });
  };
}
