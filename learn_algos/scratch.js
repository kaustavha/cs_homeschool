// Str similiarity
// given 2 strings a and b similiarity is longest common prefix
// given 1 string input, 
// output the sum of similiarities between it and all of its possible suffixes
// Check suffixes against prefix of string
// e.g. 
// ababaa => 11, i.e. ababaa, babaa, abaa, baa, aa, a have similiarities respectively 
// 6,0,3,0,1,1 
// aa => 3


var input = ['ababaa'];


function _ss(str) {
	// calc levenshtein matrix and then just take all numbers in and above diagnol
	let sArr = [], buf=[];
	for (var i = 0; i < str.length; i++) {
		str[i]
	}
}


// slow ans

function stringSimilarity(inputs) {
    let res = [];
	for (let i = 0; i < inputs.length; i++) {
		let ti = inputs[i];
		res.push(_ss(ti));
	}
	return res;
}

function _ss(str) {
	let baseStr = str, counts=str.length;

	for (let i = 1; i < str.length; i++) {
		if (str[i] == str[0]) {
			let suffix = str.substring(i, str.length);
			counts += _comp(baseStr, suffix);
		}
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