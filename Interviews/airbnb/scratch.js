var input = ['ababaa'];

function stringSimilarity(inputs) {
	for (let i = 0; i < inputs.length; i++) {
		let ti = inputs[i];
		res = _ss(ti);
	}
	return res;
}

function _ss(str) {
	let baseStr = str, counts=0;

	for (let i = 0; i < str.length; i++) {
		let suffix = str.substring(i, str.length);
		console.log(suffix);
		counts += _comp(baseStr, suffix);
	}
	return counts;
}

function _comp(baseStr, suffix) {
	let count = 0;
	for (let i = 0; i < suffix.length; i++) {
		if (suffix[i] == baseStr[i]) {
			count++;
		} else {
			break;
		}
	}
	return count;
}

console.log(stringSimilarity(input));