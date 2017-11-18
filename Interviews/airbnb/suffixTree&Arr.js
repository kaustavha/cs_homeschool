// http://www.geeksforgeeks.org/suffix-tree-application-4-build-linear-time-suffix-array/


class SuffixTreeNode {
	constructor() {
		this.children = [];
		this.suffixLink;
		this.start;
		this.end;
		this.suffixIndex;
		this.isRoot = false;
	}
}

class SuffixTree {
	constructor(txt) {
		// max char, set to alphabet size k to get O(kn) runtime
		this.max_Char;

		this.text = ''; // input str
		this.root = new SuffixTreeNode();
		this.root.isRoot = true; // ptr to root node


		/*lastNewNode will point to newly created internal node,
		  waiting for it's suffix link to be set, which might get
		  a new suffix link (other than root) in next extension of
		  same phase. lastNewNode will be set to NULL when last
		  newly created internal node (if there is any) got it's
		  suffix link reset to new internal node created in next
		  extension of same phase. */
		this.lastNewNode = null;
		this.activeNode = null;

		// activeEdge is represeted as input string character index (not the character itself)
		this.activeEdge = -1;
		this.activeLength = 0;

		// remainingSuffixCount tells how many suffixes yet to
		// be added in tree
		this.remainingSuffixCount = 0;
		this.leafEnd = -1;
		this.rootEnd = null;
		this.splitEnd = null;
		this.size = -1; // len of input str
		this.build(txt);
	}
	newNode(start, end) {
		let node = new SuffixTreeNode();

		// unnencasry in js
		// for (let i=0;i<this.max_Char; i++) {
		// 	node.children[i] = null;
		// }

		node.suffixLink = this.root;
		node.start = start;
		node.end = end;
		node.suffixIndex = -1;
		return node;
	}

	edgeLength(n){ // n is a node
		if (n.isRoot) return 0;
		return (n.end - n.start) + 1;
	}

	walkDown(currNode) {
		let el = this.edgeLength(currNode);
		if (this.activeLength >= el) {
			this.activeEdge += el;
			this.activeLength -= el;
			this.activeNode = currNode;
			return 1;
		}
		return 0;
	}

	extendSuffixTree(pos) { //pos is int
		this.leafEnd = pos;
		this.remainingSuffixCount++;
		this.lastNewNode = null;

		while (this.remainingSuffixCount > 0) {
			if (this.activeEdge == 0) this.activeEdge = pos;

			if (!this.activeNode.children[this.text[this.activeEdge]]) {
				this.activeNode.children[this.text[this.activeEdge]] = this.newNode(pos, this.leafEnd);
				if (this.lastNewNode != null) {
					this.lastNewNode.suffixLink = this.activeNode;
					this.lastNewNode = null;
				}
			} else {
				let next = this.activeNode.children[this.text[this.activeEdge]];
				if (this.walkDown(next)) {
					continue;
				}

				if (this.text[next.start+this.activeLength] == this.text[pos]) {
					if (this.lastNewNode && !this.activeNode.isRoot) {
						this.lastNewNode.suffixLink = this.activeNode;
						this.lastNewNode = null;
					}
					this.activeLength++;
					break;
				}

				this.splitEnd = next.start + this.activeLength-1;
				let split = this.newNode(next.start, this.splitEnd);
				this.activeNode.children[this.text[this.activeEdge]] = split;

				if (this.lastNewNode !== null) {
					this.lastNewNode.suffixLink = split;
				}

				this.lastNewNode = split;
			}
			this.remainingSuffixCount--;
			if (this.activeNode.isRoot && this.activeLength > 0) {
				this.activeLength--;
				this.activeEdge = pos - this.remainingSuffixCount + 1;
			} else if (!this.activeNode.isRoot) {
				this.activeNode = this.activeNode.suffixLink;
			}
		}
	}

	setSuffixIndexByDFS(node, labelHt) {
		if (node == null) return;
		let leaf = 1;
		for (let k in node.children) {
			leaf = 0;
			this.setSuffixIndexByDFS(node.children[k], labelHt + this.edgeLength(node.children[k]));
		}
		if (leaf == 1) {
			node.suffixIndex = this.size - labelHt;
		}
	}

	// freeSuffixTreeByPostOrder(node) {
	// 	if (node == null) return;
	// 	for (var k in node.children) {
	// 		this.freeSuffixTreeByPostOrder(node.children[k]);
	// 	}
	// 	if (node.suffixIndex == -1) {

	// 	}
	// }

	build(txt) {
		this.text = txt;
		this.size = this.text.length;
		this.rootEnd = -1;
		this.root = this.newNode(-1, this.rootEnd);
		this.activeNode = this.root;
		for (var i = 0; i < this.size; i++) {
			this.extendSuffixTree(i);
		}
		let labelHt = 0;
		this.setSuffixIndexByDFS(this.root, labelHt);

	}

	traverse (node, suffixArr, idx) {
		if (!node) return;
		if (node.suffixIndex == -1) {
			for (var k in node.children) {
				this.traverse(node.children[k], suffixArr, idx);
			}
		} else if (node.suffixIndex > -1 && node.suffixIndex < this.size) {
			suffixArr[idx++] = node.suffixIndex;
		}
	}

	buildSuffixArr(arr) {
		// let arr = [];
		for (var i = 0; i < this.size; i++) {
			this[i] = -1;
		}
		let idx = 0;
		this.traverse(this.root, arr, idx);
		console.log(arr);
		return arr;
	}
}


let ST = new SuffixTree('AAAAAAAAAA$');
console.log(ST.children);
var b = [];
let SA = ST.buildSuffixArr(b);
console.log(b);






