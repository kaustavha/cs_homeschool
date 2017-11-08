
class Node {
	constructor(name,id,prev,next) {
		this.name = name;
		this.id = parseInt(id);
		this.prev = prev;
		this.next = next;
	}
}

class LL {
	constructor() {
		this.list = [];
	}
	appendEarliest(name) {
		let prev = this.list[0];

		for (var i = 1; i < this.list.length; i++) {
			let tn =this.list[i], nn = this.list[i+1];
			if (nn) {
				if ();
			}
		}
	}
}

class ServerManager {
	constructor() {
		this.servers = {};
	}
	allocate(name) {
		if (!this.servers[name]) this.servers[name] = new singlyLinkedList();
		let tn = this.servers[name], allocd = false;
		let id = tn.appendEarliest(name);
		return name+id;
	}
	deallocate(str) {
		let name = str.match(/^[a-z]*/gi),
			id = str.match(/[0-9]*$/gi);
		if (this.servers[name]) {
			this.servers[name].deleteNode(id);
		}
	}

}

class ServerManager {
	constructor(){
		this.servers = {};
	}
	allocate(str) {
		// api1 or api2 or api
		// => api1, api2, api3
		let name = str.match(/^[a-z]*/gi)[0],
			id = str.match(/[0-9]*$/gi)[0],
			hasId = id.length > 0,
			allocd;
		if (!this.servers[name]) {
			if (!hasId) id = 1;
			this.servers[name] = new Node(name, id);
		} else {
			let tn = this.servers[name];
			if (!hasId) {
				while (tn.next) {
					if (tn.next.id > tn.id+1) {
						id = tn.id+1;
						let nn = new Node(name, id, tn, tn.next);
						nn.next = tn.next;
						if (tn.next) tn.next.prev = nn;
						tn.next = nn;
						allocd = true;
						break;
					}
					tn = tn.next;
				}
				if (!allocd) {
					id = tn.id + 1;
					tn.next = new Node(name, id, tn);
				}
			} else {
				while (tn.next) {
					if (tn.id == id) {
						allocd=true;
						break;
					}
					if (tn.id > id && tn.prev.id ) {
						let op = tn.prev,
							on = tn.next,
							nn = new Node(name, id, op, tn);
						tn.prev = nn;
						op.next = nn;
						allocd= true;
						break;
					}
					tn = tn.next;
				}
				if (!allocd) {
					tn.next = new Node(name, id, tn);
				}
			}
		}
		return name+id;
	}
	deallocate(str) {
		let name = str.match(/^[a-z]*/gi)[0],
			id = str.match(/[0-9]*$/gi)[0],
			hasId = id.length > 0,
			res = name+id,
			allocd;
		let tn = this.servers[name];
		while (tn) {
			if (tn.id == id) {
				if (tn.next) {
					tn.next.prev = tn.prev;
				}
				if (tn.prev) tn.prev.next = tn.next;
				break;
			}
			tn = tn.next;
		}
	}
}

let SM = new ServerManager();
console.log(SM.allocate('apibox'));
console.log(SM.allocate('apibox'));
console.log(SM.allocate('sitebox'));
console.log(SM.allocate('apibox'));
SM.deallocate('apibox2');
console.log(SM.allocate('apibox'));



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
