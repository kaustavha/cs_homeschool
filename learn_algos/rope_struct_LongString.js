
// todo

class Node {
    constructor(weight, val) {
        this.weight = weight;
        this.right = false;
        this.left = false;
        this.val = val || false;
    }
}
class LongString {
    constructor(s='') {
        this.str = s;
        this.root = this._createRope(s)
    }

    _createRope(s) {
        let i = 0;
        let ropeUnitQ = [];
        while (i < s.length) {
            let {ropeUnit, iter} = this._createRopeUnit(s, i);
            i = iter;
            ropeUnitQ.push(ropeUnit)
        }
        console.log(i, s, ropeUnitQ)
        while (ropeUnitQ.length > 1) {
            ropeUnitQ = this._processRopeUnitQ(ropeUnitQ);
        }

        return ropeUnitQ[0];
    }

    _processRopeUnitQ(q) {
        let resQ = [];
        while (q.length > 0) {
            let a = q.pop(),
                b = q.pop(),
                res = this._joinRopeNodes(a, b);
            resQ.push(res);
        }
        return resQ;
    }

    _createRopeUnit(str, i) {
        let left = str.slice(i, i+1),
            right = str.slice(i+1, i+2),
            leftNode = new Node(1, left),
            rightNode = new Node(1, right),
            root = new Node(1);
        root.left = leftNode;
        root.right = rightNode;
        i += 2;
        return {
            ropeUnit: root,
            iter: i
        }
    }

    _joinRopeNodes(nodeA, nodeB) {
        let weight = nodeA ? nodeA.weight : 0;
        if (nodeA && nodeA.left) {
            let tmpNode = nodeA.left;
            while (tmpNode.left && tmpNode.left.left) {
                tmpNode = tmpNode.left;
            }
            weight += tmpNode.right.weight || 0 + tmpNode.left.weight || 0;
        }
        let root = new Node(weight);
        root.left = nodeA;
        root.right = nodeB;
        return root;
    }

    charAt(i=0) {
        return this._findChar(this.root, i);
    }

    _findChar(node, i) {
        if (node.weight < i && node.right) {
            return this._findChar(node.right, i-node.weight);
        }
        if (node.left) {
            return this._findChar(node.left, i);
        }
        return node.val
    }

    _findCharOld(node, i) {
        if (node.val) return node.val;
        if (node.weight/2 > i) return this._findChar(node.right, i-node.weight/2);
        return this._findChar(node.left, i)
    }

    _findCharNodeParent(node, i) {
        if (node.left.val || node.right.val) return node;
        if (node.weight/2 > i) return _findCharNodeParent(node.right, i);
        return _findCharNodeParent(node.left, i)
    }

    _deleteChar(i) {
        let pnode = this._findCharNodeParent(node, i);

    }

    delete(start=0, end=0) {
        let left = this.root,
            right = this.root;

        while (left.weight/2 > start) {
            left = left.left;
        }
    }
}

let ls = new LongString("watchtower");
console.log(ls.root);

console.log(ls.charAt(1))
console.log(ls.charAt(2))
console.log(ls.charAt(3))
console.log(ls.charAt(4))
console.log(ls.charAt(5))
console.log(ls.charAt(6))
console.log(ls.charAt(7))
console.log(ls.charAt(8))
console.log(ls.charAt(9))
console.log(ls.charAt(10))