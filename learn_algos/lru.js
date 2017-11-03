/**
 * @param {number} capacity
 */

class Node {
    constructor(k,v,p,n) {
        this.key = k;
        this.value = v;
        this.prev = p;
        this.next = n;
    }
}

class LRUCache() {
    contructor() {

    }
}

var LRUCache = function(capacity) {
    this.cap = capacity;
    this.current = 0;
    this.head = new Node();
    this.tail = new Node();
    this.head.next = this.tail;
    this.tail.prev = this.head;
    this.cache = {};
    this.cleanup = function() {
        if (this.cap == this.current) {
            let newTail = this.tail.prev;
            let leastRecent = this.tail;
            delete this.cache[leastRecent.key];
            newTail.next = null;
            this.tail = newTail;
            this.current--;
        }
    }
    this.updateLRU = function(key, val) {
        let cache = this.cache;
        let newHead;
        if (cache[key]) {
            newHead = cache[key];
            if (cache[key].next)
                cache[key].next.prev = cache[key].prev;
            if (cache[key].prev)
                cache[key].prev.next = cache[key].next;
        } else {
            newHead = new Node(key,val);
            cache[key] = newHead;
            this.current++;
        }
        cache[key].next = this.head;
        cache[key].prev = null;
        this.head = cache[key];
        this.cache = cache;
        this.cleanup();
    }
};

/** 
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
    if (!this.cache[key]) return null;
    this.updateLRU(key);
    return this.cache[key];
};

/** 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {
    this.updateLRU(key,value);
    
};

/** 
 * Your LRUCache object will be instantiated and called as such:
 * var obj = Object.create(LRUCache).createNew(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */