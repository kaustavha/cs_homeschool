class Node {
	constructor(data) {
		this.data = data;
		this.next = null;
	}
}

class singlyLinkedList {
	constructor() {
		this.head = null;
	}

	print() {
		let thisNode = this.head, str = '';
		str += thisNode.data;
		while (thisNode.next) {
			thisNode = thisNode.next;
			str += ' -> ' + thisNode.data;
		}
		console.log(str);
	}

	appendToTail(data) {
		let end = new Node(data), thisNode;
		if (this.head == null) {
			this.head = end;
			return;
		} else {
		    thisNode = this.head;
			while (thisNode.next) {
				thisNode = thisNode.next;
			}
			thisNode.next = end;
		}
	}

	deleteNode(data) {
		let thisNode = this.head, prevNode;
		if (thisNode.data == data) {
			thisNode = thisNode.next;
		} else {
			while (thisNode.next) {
				prevNode = thisNode;
				if (thisNode.data == data) {
					thisNode = thisNode.next;
					break;
				}
				thisNode = thisNode.next;
			}
			if (thisNode.data == data) {
				prevNode.next = null;
			}
		}
		return this.head;
	}

	// 2.1 Remove dups
	removeDups() {
		let thisNode = this.head,
			buffer = {}, prevNode;
		buffer[thisNode.data] = 1;
		while (thisNode.next) {
			prevNode = thisNode;
			thisNode = thisNode.next;
			if (buffer[thisNode.data] !== undefined) {
				prevNode.next = thisNode.next;
			} else {
				buffer[thisNode.data] = 1;
			}
		}
		if (buffer[thisNode.data] !== undefined) {
			prevNode.next = null;
		}
		return this.head;
	}
	removeDupsNobuffer() {
		// try runner technique, more time, 
		let thisNode = this.head, prevNode, scannerNode, prevScannerNode;
		while (thisNode.next) {
			scannerNode = thisNode;
			while (scannerNode.next) {
				prevScannerNode = scannerNode;
				scannerNode = scannerNode.next;
				if (scannerNode.data == thisNode.data) {
					prevScannerNode.next = scannerNode.next;
				}
			}
			thisNode = thisNode.next;
		}
	}
}

let sll = new singlyLinkedList();
sll.appendToTail(1);
sll.appendToTail(2);
sll.appendToTail(2);
sll.print();
sll.removeDups();
sll.print();
sll.appendToTail(1);
sll.appendToTail(3);
sll.removeDupsNobuffer();
sll.print();
sll.deleteNode(3);
sll.print();