
class Node {
    constructor(val, ts) {
        this.val = val;
        this.timestamp = ts;
        this.next;
    }
}

module.exports = class TTKV {
    constructor() {
        this.store = {};
    }
    put(key, value) {
        if (!this.store[key] || this.store[key] == undefined) {
            this.store[key] = [];
        }
        let currentTime = Date.now();

        this.store[key].push({
            time: currentTime,
            val: value
        })
    }
    get(key, timestamp) {

        // console.log("ts, ",timestamp);

        if (!this.store[key] || this.store[key] == undefined) return null;
        let searchArr = this.store[key];

        let pre = null;
        // let ele;
        for (let i=0; i<searchArr.length; i++) {
            let ele = searchArr[i];
            if (ele.time == timestamp) return ele.val;
            if (pre && (ele.time > timestamp && pre.time <= timestamp)) return pre.val;
            pre = ele;
        }

        if (pre.time < timestamp) return pre.val;
        return null;
    }
}