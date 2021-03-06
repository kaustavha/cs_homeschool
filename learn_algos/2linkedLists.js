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

	mergeSortSelf() {
		return this.mergeSortList(this.head);
	}

	mergeSortList(head) {
		// list with 1 item is sorted 
		if (!head || !head.next) return head;

		let tn = head,
			slow = tn,
			fast = tn.next,l1,l2;
		while (fast && fast.next) {
			slow = slow.next;
			fast = fast.next.next;
		}
		l2 = slow.next;
		slow.next = null;
		l1 = this.mergeSortList(head);
		l2 = this.mergeSortList(l2);
		return _merge(l1, l2);

		function _merge(l1,l2) {
			let mergedHeadSoFar = new Node(), pre = mergedHeadSoFar;
			while (l1 && l2) {
				if (l1.data < l2.data) {
					mergedHeadSoFar.next = l1;
					l1 = l1.next;
				} else {
					mergedHeadSoFar.next = l2;
					l2 = l2.next;
				}
				mergedHeadSoFar = mergedHeadSoFar.next;
			}

			if (l1) mergedHeadSoFar.next = l1;
			if (l2) mergedHeadSoFar.next = l2;

			// prevent circular deps
			while (mergedHeadSoFar.next) {
				mergedHeadSoFar = mergedHeadSoFar.next;
			}
			mergedHeadSoFar.next = null;

			return pre.next;
		}
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

	appendEarliest(data) {
		let end = new Node(data), thisNode = this.head, let pos =0;
		if (thisNode == null) {
			thisNode = end;
			return pos++;
		}
		while (thisNode.next) {
			let nextData = thisNode.next.data;
			if (nextData > data) {
				end.next = thisNode.next;
				thisNode.next = end;
				return pos;
			}
			thisNode = thisNode.next;
			pos++;
		}
		// apend to end if we havent appended yet
		if (!thisNode.next) thisNode.next = end;
		return pos++;
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

	deleteAtPos(pos) {
		if (this.head == null || pos < 0) return this.head;
		let i = 0, thisNode = this.head, prevNode;
		while (i < pos && thisNode.next) {
			prevNode = thisNode;
			thisNode = thisNode.next;
			i++;
		}

		if (thisNode.next && prevNode) {
			prevNode.next = thisNode.next;
		} else if (thisNode.next && !prevNode) {
			this.head = thisNode.next;
		} else if (prevNode && !thisNode.next) {
			prevNode.next = thisNode.next;
		}

		return this.head;

	}

	deleteNode(data) {
		if (this.head == null) return this.head;

		if (this.head.data == data) {
			if (this.head.next) this.head = this.head.next;
			return this.head;
		}

		let thisNode = this.head, prevNode;

		while (thisNode.next) {
			prevNode = thisNode;
			thisNode = thisNode.next;
			if (thisNode.data == data) {
				prevNode.next = thisNode.next;
				break;
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
sll.appendEarliest(1);
sll.appendEarliest(4);
sll.appendEarliest(3);
sll.deleteNode(2);
sll.deleteNode(1);
sll.appendEarliest(2);
sll.appendToTail(2);
sll.appendEarliest(1);
sll.appendToTail(3);
sll.appendToTail(2);
sll.appendToTail(4);
sll.print(); // 1 -> 1 -> 2 -> 3 -> 4 -> 2
sll.mergeSortSelf();
sll.print(); // 1 -> 1 -> 2 -> 3 -> 4
sll.deleteAtPos(0);
sll.deleteAtPos(6);
sll.print(); // 1 2 3 4
