class ObjectKeysSorter {
	sort(object){
		let ordered;
		if(typeof object === "string"){
			ordered = object;
		} else {
			ordered = this.sortObject(object);
			Object.keys(ordered).forEach((key) => {
				if(ordered[key] !== undefined && ordered[key] !== null){
					if(Array.isArray(ordered[key])){
						const items = [];
						ordered[key].forEach((item) => {
							items.push(this.sort(item));
						});
						ordered[key] = items;
					} else if(typeof ordered[key] === 'object') {
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
export default ObjectKeysSorter;