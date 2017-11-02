import * as es          from 'event-stream';
import ObjectKeysSorter from '../objectKeysSorter';
let order = function(){
  const mapper = es.through(function write(document) {
    try {
      let unorderedObject = JSON.parse(document.docRawSchema);
      let orderedObject = new ObjectKeysSorter().sort(unorderedObject);
      let orderedObjectJson = JSON.stringify(orderedObject);
      if(document.docRawSchema === orderedObjectJson){
        console.log("ficou igual");
        this.emit('ignore');
      } else {
        this.emit('progress', {'_id': document._id, 'docRawSchema': orderedObjectJson, 'batchId': document.batchId, 'value': document.value});
      }
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