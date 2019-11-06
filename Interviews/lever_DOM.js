/**
 * Lever 2nd round video chat interview Q
 * Total interview:
 * - 1 coding round - 1hr
 * - 1 project discussion - 1hr
 * 
 * This is the coding section
 * OOP, nodes, trees, linked list, depth first search based question; also requires knowledge of refs and scope
 * parts based - parts revealed sequentially
 * due to problem quirks interviewer may offer to reveal other parts earlier to help
 * 5 total parts
 * Time limit: 60 mins -> minus 5 mins for tech delay, 10 min for intros (45 mins)
 * Actual: managed to get 3/5, 4th is easy, 5th needs a bit of recursive search logic and code
 * 
 */

/*
Background: Let's work together to build a simple DOM. We'll implement a basic Node class, as well as minimal Element and Text classes that inherit from Node.

## Step 1

First, we'll implement a Node class with the properties:

  parentNode
  firstChild
  lastChild
  previousSibling
  nextSibling

Then, implement a method childNodes() that returns an array of the current node's children nodes.

Note: Please compute the child nodes on each method call, instead of storing a persistent list of child nodes on the Node.
- construct in real time, is just direct child


(Modern DOM implementations don't upkeep arrays of child nodes for performance reasons. In the actual DOM API, childNodes is a read-only NodeList property, which is an array-like live collection of nodes. For the purposes of this interview, a method that returns an array is simpler.)

*/


class Node {
    constructor({ parentNode = null, firstChild = null, lastChild = null, previousSibling = null, nextSibling = null, id = null }) {
        this.nextSibling = nextSibling
        this.previousSibling = previousSibling;
        this.lastChild = lastChild;
        this.firstChild = firstChild;
        this.parentNode = parentNode;
        this.id = id;
    }
    // debug helper 
    _dcn() {
        return this.childNodes().map(n => n.id)
    }
    childNodes() {
        if (this.firstChild === null) return [];
        let curPtr = this.firstChild;
        let out = [];
        while (curPtr.nextSibling !== null) {
            out.push(curPtr);
            curPtr = curPtr.nextSibling;
        }
        out.push(curPtr);
        return out;
    }
    appendChild(node) {
        node.parentNode = this;
        if (this.lastChild === null && this.firstChild === null) {
            this.firstChild = this.lastChild = node;
        } else {
            let lastRef = this.lastChild; /// looklout for bug with copy ref
            this.lastChild = node;
            lastRef.nextSibling = this.lastChild;
            this.lastChild.previousSibling = lastRef;
        }
    }
    insertBefore(node, referenceNode) {
        if (referenceNode === null) this.appendChild(node);

        node.nextSibling = referenceNode;
        let prevSibling = referenceNode.previousSibling;
        if (prevSibling === null) {
            this.firstChild = node;
        } else {
            prevSibling.nextSibling = node;
            node.previousSibling = prevSibling;
        }

        referenceNode.previousSibling = node;
        if (referenceNode.nextSibling === null) {
            this.lastChild = referenceNode;
        }
    }
}

/*

## Step 2

Next, we'll implement a method to append a node to the "end" of the current node's children:

    appendChild(node)

Once we've implemented this method, the following test should work:

*/

// var parent = new Node({});
// var child1 = new Node({});
// var child2 = new Node({});
// var child3 = new Node({});
// parent.appendChild(child1);
// parent.appendChild(child2);
// parent.appendChild(child3);

// console.log(parent.childNodes());  // Should print an array of 3 nodes


/*

## Step 3

The last Node method we'll implement is:

    insertBefore(node, referenceNode)

This inserts `node` just before `referenceNode`. If `referenceNode` is null, then `node` is inserted at the end of the current node's children nodes.

(The second part means that the DOM doesn't need an insertAfter method. Instead, a node can be inserted after a reference node via `parent.insertBefore(node, referenceNode.nextSibling)`.)

Please write your own test cases for insertBefore!

*/

var parent = new Node({ 'id': 'p' });
var child1 = new Node({ 'id': 1 });
var child2 = new Node({ 'id': 2 });
var child3 = new Node({ 'id': 3 });
parent.appendChild(child1);
parent.appendChild(child2);

console.log(parent.childNodes().length);

parent.insertBefore(child3, child1);
console.log(parent._dcn());


/*

## Step 4

Next, we'll implement the Text node class, which inherits from Node.

Text nodes have a string `data` property that is required when creating them.

*/

// Put Text class here
class Text extends Node {
    constructor(args) {
        super(args)
        this.data = args.data;
    }
}

parent.appendChild(new Text({id: 'txt', data: 'hello world'}))

console.log(parent._dcn());


/*

## Step 5

Finally, we'll implement an Element class, which also inherits from Node.

Elements have a `tagName` property that is required when creating them.


We'll also implement an `innerHTML()` getter method on Element, which should return the HTML string representation of the inner contents of the Element.

(This is a read/write property in the real DOM, but once again, we'll implement it as a method for simplicity. HTML parsing is... very complicated.)

*/

class Element extends Node {
    constructor(args) {
        super(args)
        this.tagName = args.tagName || null;
    }
    innerHTML() {
        // find child text nodes
        // return data of text nodes
        // recursively iterate through all children too
        let buffer = '';

        this.childNodes().forEach(node => {
            if (node.tagName !== undefined) {
                buffer += node.innerHTML()
            }

            if (node.data) {
                buffer += node.data;
            }
        })
        return buffer;
    }
}

// test is recursive/ tree based child text node addition works
var parent = new Element({ 'id': 'p', tagName: '1' });
var child1 = new Text({id: 1, data: 'hello'})
var child2 = new Text({id: 2, data: 'world'})
var child3 = new Node({ 'id': 3 });
parent.appendChild(child1);
parent.appendChild(child2);

parent.appendChild(child3);

var spchild = new Element({ 'id': 'p2', tagName: '1' })
spchild.appendChild( new Text({id: 1, data: 'world'}))
spchild.appendChild( new Text({id: 1, data: 'hello'}))

parent.appendChild(spchild)

console.log(parent.childNodes())
console.log(parent.innerHTML())
console.log(parent._dcn())
