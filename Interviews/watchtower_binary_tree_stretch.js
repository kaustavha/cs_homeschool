/**
 * From Kyle Bradford to Everyone: (05:06 PM)
 Write a recursive function named stretch that replaces each single binary tree node with multiple nodes
with smaller values. Your function accepts two parameters:
    a reference to a TreeNode pointer representing the root of a binary tree,
    and an integer "stretching factor" K. 
Your function should replace each node N with K nodes, 
each of which stores a data value that is 1/K of N's original value, 
using integer division.
The new clones of node N should extend from their parent in the same direction that N extends from its parent.
For example, if N is its parent's left child, 
the stretched clones of N should also be their parent's left child, 
and vice versa if N was a right child. 
The root node is a special case because it has no parent;
we will handle this by saying that its stretched clones should extend to the left.
https://imgur.com/a/mfholT9
 */

class Node {
    constructor(num, left=false, right=false) {
        this.val = num;
        this.left = left;
        this.right = right;
    }
}
function stretch(BTreePtr, k) {
    function _stretch(ptr, dir) {
        let val = ptr.val;
        let newVal = Math.floor(val/k);
        if (dir == 'left') {
            _addNodes(ptr, newVal, k, 'left')
        } else if (dir == 'right') {
            _addNodes(ptr, newVal, k, 'right')
        }
    }

    function _addNodes(ptr, val, k, dir) {
        let lchild = ptr.left,
            rchild = ptr.right,
            count = k;
            ptr.val = val;
        while (count > 1) {
            let newNode = new Node(val);
            if (dir == 'right') {
                ptr.right = newNode;
                ptr = ptr.right;
            } else {
                ptr.left = newNode;
                ptr = ptr.left;
            }
            count--;
        }
        ptr.left = lchild;
        ptr.right = rchild; 
        if (lchild) _stretch(lchild, 'left');
        if (rchild) _stretch(rchild, 'right');
    }

    _stretch(BTreePtr, 'left');
    return BTreePtr;
}


let testTree = new Node(12);
testTree.left = new Node(81);
testTree.left.left = new Node(56);
testTree.right = new Node(34);
testTree.right.right = new Node(6);
testTree.right.left = new Node(19);
console.log(testTree);

stretch(testTree, 2);
console.log('Expanded tree', testTree)

console.log(testTree.right.val, testTree.right.right.val)

console.log(testTree.right.right.right.val, testTree.right.right.right.right.val)

console.log(testTree.right.right.right.val, testTree.right.right.right.right.val)
console.log(testTree.val, testTree.left.val, testTree.left.left.val, testTree.left.left.left.val)