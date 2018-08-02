export default class RawSchemaUnifier {

  private rootSchema = {
    fields: [],
    count: 0
  };

  union = (documents) => {
    documents.forEach((document) => {
      this.buildRawSchema(JSON.parse(document._id), Number(document.value), this.rootSchema.fields, null);
      this.rootSchema.count = this.sum(this.rootSchema.count, document.value);
    });
    return this.rootSchema;
  };

  private buildRawSchema = (document, count, fields, parent) => {
    Object.keys(document).forEach((key) => {
      const path = parent != null ? `${parent}.JSONSCHEMADISCOVERY.${key}` : key;
      this.addToField(path, document[key], fields, count);
    });
  };

  private addToField = (specialPath, value, fields, count) => {
    const lastPath = specialPath.split('.JSONSCHEMADISCOVERY.').pop();
    const regexp = new RegExp('.JSONSCHEMADISCOVERY.', 'g');
    const path = specialPath.replace(regexp, '.');
    let field = fields.find(currentField => currentField.path === path);
    field = this.getOrUpdateInstance(field, fields, lastPath, path, count);
    if (!field.types) field.types = [];
    this.addToType(path, value, field.types, count);
  };

  private addToType = (path, value, types, count) => {
    const typeName = this.getTypeFromValue(value);
    let type = types.find(currentType => currentType.name === typeName);
    type = this.getOrUpdateInstance(type, types, typeName, path, count);
    this.workOnType(path, value, type, typeName, count);
  };

  private addToItem = (path, value, items, count) => {
    const typeName = this.getTypeFromValue(value);
    let item = items.find(currentItem => currentItem.name === typeName && currentItem.path === path);
    item = this.getOrUpdateInstance(item, items, typeName, path, count);
    this.workOnType(path, value, item, typeName, count);
  };

  private workOnType = (path, value, instance, typeName, count) => {
    if (typeName === 'Array') {
      if (!instance.items) instance.items = [];
      value.forEach(arrayItem => this.addToItem(path, arrayItem, instance.items, count));
    } else if (typeName === 'Object') {
      if (!instance.fields) instance.fields = [];
      this.buildRawSchema(value, count, instance.fields, path);
    }
  };

  private getTypeFromValue = (value) => {
    if (typeof value === 'string') {
      return value;
    } else if (Array.isArray(value)) {
      return 'Array';
    } else {
      return 'Object';
    }
  };

  private sum = (value1, value2) => Number(value1) + Number(value2);

  private getOrUpdateInstance = (instance, instances, name, path, count) => {
    if (!instance) {
      instance = {
        'name': name,
        'path': path,
        'count': Number(count)
      };
      instances.push(instance);
    } else {
      instance.count = this.sum(instance.count, count);
    }
    return instance;
  };

}
