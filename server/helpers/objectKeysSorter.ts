abstract class ObjectKeysSorter {
	static sort(object) {
		const ordered = ObjectKeysSorter.sortObject(object);
		Object.keys(ordered).forEach((key) => {
			if(ordered[key] !== undefined && ordered[key] !== null){
				if(Array.isArray(ordered[key])){
					const items = [];
					ordered[key].forEach((item) => {
						items.push(ObjectKeysSorter.sort(item));
					});
					ordered[key] = items;
				} else if(typeof ordered[key] === 'object') {
					ordered[key] = ObjectKeysSorter.sort(ordered[key]);
				}
			}
		});
		return ordered;
	}
	static sortObject(o) {
	    return Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});
	}
}
export default ObjectKeysSorter;