// key value store w. history

class Node {
	constructor(val, ts) {
		this.val = val;
		this.timestamp = ts;
		this.next;
		this.prev;
	}
}

class KvStore {
	constructor() {
		this.store = {};
	}
	add(key, value) {
		let secs = Date.now(),
			node = new Node(value, secs);
		if (!this.store[key]) {
			this.store[key] = node
		} else {
			let pre = this.store[key],
				head = pre;

			while (pre.next) {
				pre = pre.next;
			}
			pre.next = node
			this.store[key] = head;
		}
		return secs;
	}
	extractNode(pre) {
		return new Node(pre.val, pre.timestamp)
	}
	getFirst(key) {
		if (!key) return null;
		if (!this.store[key]) return null;
		let pre = this.store[key];
		return this.extractNode(pre);
	}
	getLast(key) {
		if (!key) return null;
		if (!this.store[key]) return null;
		let pre = this.store[key];
		while (pre.next) {
			pre = pre.next;
		}
		return this.extractNode(pre);
	}
	getAtTime(key, timestamp) {
		if (!key) return null;
		if (!this.store[key]) return null;
		let pre = this.store[key];
		while (pre.next) {
			if (pre.timestamp == timestamp) return pre.val;
			pre = pre.next;
		}
		if (pre.timestamp == timestamp) return pre.val;
		return null;
	}
}

module.exports = KvStore;
