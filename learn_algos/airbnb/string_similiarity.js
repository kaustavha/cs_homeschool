/*
2 strings have similiary as length of longest shared prefix

e.g. abc & abd = 2, aaa & aaab = 3
calc sum of sims of a string S w/ each of its suffixes, including whole string as 1st suffix

in

1
ababaa

1
aa

====
out

11

3

*/


// slow shit answer 


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


// need to use suffix trees, build one in O(n) time and flatten it in O(n) to a suffix array then count through that in O(n)
