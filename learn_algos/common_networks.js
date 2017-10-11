// given optsets, find all permutations
/*
examples:

[[a],[a],[a]] => (a,a,a)
[[a], [b], [a]] => (a,b,a)
[[a,b], [c,d]] => (a,b), (b,c), (c,d), (a,d)
[[a], [a,b], [a,c,d]] => (a,a,a), (a,b,a), (a,b,c), (b,c,d)
*/

function findPerms(optSet) {
// merge all the optsets into hashtable with frequency
	let map = {},
		out = [];
	let resL = optSet.length;
	for (var i = 0; i < resL; i++) {
		for (var j = 0; j < optSet[i].length; j++) {
			if (map[optSet[i][j]]) {
				map[optSet[i][j]]++;
			} else {
				map[optSet[i][j]] = 1;
			}
		}
	}

	function _findPerms(pre, rest) {
		let n = rest.length;
		if (n==0) return;
		if (pre.length == resL) {
			out.push(pre);
			pre = [];
		}
		for (var i = 0; i < rest.length; i++) {
			rest[i]
		}

	}

	let temp = [];
	for (var k in map) {
		if (map[k] >= resL) {
			for (var l = 0; l < resL; l++) {
				temp.push(l);
			}
			out.push(temp);
			temp = [];
		} else {

		}
	}
}

// test
let inp = [['a'],['a'],['a']];
let out = findPerms(inp);
console.log(out);