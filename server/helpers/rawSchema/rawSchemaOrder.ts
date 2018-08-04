import * as es from 'event-stream';
import ObjectKeysSorter from '../objectKeysSorter';

const order = function () {
  const mapper = es.through(function write(document) {
    try {
      const unorderedObject = JSON.parse(document.docRawSchema);
      const orderedObject = new ObjectKeysSorter().sort(unorderedObject);
      const orderedObjectJson = JSON.stringify(orderedObject);
      if (document.docRawSchema === orderedObjectJson) {
        this.emit('ignore');
      } else {
        this.emit('progress', {
          '_id': document._id,
          'docRawSchema': orderedObjectJson,
          'batchId': document.batchId,
          'value': document.value
        });
      }
    } catch (error) {
      console.error('grave error >>> ', error);
      console.error('document error >>> ', document);
    }
  }, function end() {
    this.emit('end');
  });
  // mapper.on('close', () => this.destroy());
  return mapper;
};

export default order;
