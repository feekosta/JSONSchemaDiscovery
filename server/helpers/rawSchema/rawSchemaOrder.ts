import * as es          from 'event-stream';
import ObjectKeysSorter from '../objectKeysSorter';
let order = function(){
  const mapper = es.through(function write(document) {
    let unorderedObject = JSON.parse(document.docRawSchema);
    let orderedObject = new ObjectKeysSorter().sort(unorderedObject);
    this.emit('progress', {'_id': document._id, 'docRawSchema': JSON.stringify(orderedObject) });
  }, function end() {
    this.emit('end');
  });
  mapper.on('close', function() {
    this.destroy();
  });
  return mapper;
}
export default order;