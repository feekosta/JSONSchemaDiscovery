export default class ObjectKeysSorter {
  sort(object) {
    let ordered;
    if (typeof object === 'string') {
      ordered = object;
    } else if (Array.isArray(object)) {
      const items = [];
      object.forEach((item) => {
        items.push(this.sort(item));
      });
      ordered = items.sort();
    } else {
      ordered = this.sortObject(object);
      Object.keys(ordered).forEach((key) => {
        if (ordered[key] !== undefined && ordered[key] !== null) {
          if (Array.isArray(ordered[key])) {
            const items = [];
            ordered[key].forEach((item) => {
              items.push(this.sort(item));
            });
            ordered[key] = items.sort();
          } else if (typeof ordered[key] === 'object') {
            ordered[key] = this.sort(ordered[key]);
          }
        }
      });
    }
    return ordered;
  }

  sortObject(o) {
    return Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});
  }
}
