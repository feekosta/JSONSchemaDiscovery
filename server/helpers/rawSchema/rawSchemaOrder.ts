import * as es          from 'event-stream';
import ObjectKeysSorter from '../objectKeysSorter';
let order = function(){
  const mapper = es.through(function write(document) {
    try {
      let unorderedObject = JSON.parse(document.docRawSchema);
      let orderedObject = new ObjectKeysSorter().sort(unorderedObject);
      this.emit('progress', {'_id': document._id, 'docRawSchema': JSON.stringify(orderedObject) });  
    } catch (error) {
      console.error("grave error >>> ",error);
      console.error("document error >>> ",document);
    }
    
  }, function end() {
    this.emit('end');
  });
  mapper.on('close', function() {
    this.destroy();
  });
  return mapper;
}
export default order;