/*
2 strings have similiary as length of longest shared prefix

e.g. abc & abd = 2, aaa & aaab = 3
calc sum of similiarys of a string S w/ each of its suffixes, including whole string

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
/*
http://brenden.github.io/ukkonen-animation/
https://stackoverflow.com/questions/9452701/ukkonens-suffix-tree-algorithm-in-plain-english/9513423#9513423
*/


class Trie {
	constructor() {
		this.root = new TreeNode();
		this.root.val = '';
	}
	insert(word) {
		let pre = this.root;
		for (var i = 0; i < word.length; i++) {
			let tc = word[i];
			if (pre.children[tc] == null) pre.children[tc] = new TreeNode(tc);
			pre = pre.children[tc];
		}
		pre.isWords = true;
	}
	// get combined length of all words that share this 1st char
	getLength(letter) {
		let pre = this.root, count = 0;
		function _count(pre, letter) {
			if (pre.children[letter]) {
				for (var k in pre.children) {

				}
			}
		}
		if (pre.children[letter]) {
			pre = pre.children[letter];
			for (var k in pre.children) {

			}
		}
	}
}


class TreeNode {
	constructor(val) {
		this.val = val || null;
		this.children = {};
		this.isWord = false;
	}
}

class SuffixTree {
	constructor() {
		this.root = new TreeNode();
	}
	insert(char) {
		let pre = this.root;
		while (pre.next) {
			pre = pre.next;
			if (pre.val == char) {

			}
		}
		if (pre.next) {
			pre = pre.next;
		} else {

		}
	}
}

function stringSimilarity(inputs) {
    let res = [];
	for (let i = 0; i < inputs.length; i++) {
		let ti = inputs[i];
		res.push(_ss(ti));
	}
	return res;
}

function createSuffixTree() {

}

class Node {
	constructor(start, end){
		this.start = start;
		this.end = end;
		this.treeMap = {};
	}
	edgeLength(pos) {
		return Math.min(this.end, pos+1) - this.start;
	}
}


/// declr block to make life easier
// let rootN = this.root,
// 	position = this.position,
// 	currentNode = this.currentNode,
// 	needSuffixLink = this.needSuffixLink,
// 	remainder = this.remainder,
// 	active_node = this.active_node,
// 	active_length = this.active_length,
// 	active_edge = this.active_edge,
// 	nodes = this.nodes,
// 	text = this.text;

// declr back
// this.root = rootN;
// this.position = position;
// this.currentNode = currentNode;
// this.needSuffixLink = needSuffixLink;
// this.remainder = remainder;
// this.active_node = active_node;
// this.active_length = active_length;
// this.active_edge = active_edge;
// this.nodes = nodes;
// this.text = text;



// https://gist.github.com/makagonov/22ab3675e3fc0031314e8535ffcbee2c
class SuffixTree {

	constructor() {
		this.root;
		this.position;
		this.currentNode;
		this.needSuffixLink;
		this.remainder;
		this.active_node;
		this.active_length;
		this.active_edge;
		this.nodes;
		this.text;


		this.position = -1;
		this.currentNode = 0;

		this.nodes = [];
		this.text = [];
		this.root = this.active_node = this.newNode(-1,-1);
	}

	addSuffixLink(node) {
		if (this.needSuffixLink > 0) nodes[this.needSuffixLink].link = node;
		this.needSuffixLink = node;
	}

	active_edge() {
		return this.text[this.active_edge];
	}

	walkDown(next) {
		if (this.active_length >= this.nodes[next].edgeLength()) {
			this.active_edge += this.nodes[next].edgeLength();
			this.active_length -= this.nodes[next].edgeLength();
			this.active_node = next;
			return true;
		}
		return false;
	}

	newNode(start, end) {
		this.nodes[++this.currentNode] = new Node(start, end);
	}

	addChar(c) {
	let rootN = this.root,
		position = this.position,
		currentNode = this.currentNode,
		needSuffixLink = this.needSuffixLink,
		remainder = this.remainder,
		active_node = this.active_node,
		active_length = this.active_length,
		active_edge = this.active_edge,
		nodes = this.nodes,
		text = this.text;

	text[++position] = c;
	needSuffixLink = -1;
	remainder++;

	while (remainder > 0) {
		if (active_length == 0) active_edge = position;
		if (!nodes[active_node].next[active])
	}


		this.text[++this.position] = c;
		this.needSuffixLink = -1
		this.remainder++;
		while (this.remainder > 0) {
			if (this.active_length == 0) this.active_edge = this.position;
			if (!this.nodes[this.active_node].next.)
		}
	}


}

























