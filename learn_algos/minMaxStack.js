/**
 * Implement a datastructure
 * that has push, pop, get_max, get_min, in constant time
 */

class MinMaxStack {
    constructor() {
        this.stack = [];
        this.minStack = [];
        this.maxStack = [];
    }
    getMax() {
        return this.maxStack[this.maxStack.length-1] || 0
    }
    getMin() {
        return this.minStack[this.minStack.length-1] || Infinity
    }
    push(num) {
        this.stack.push(num);
        if (num >= this.getMax()) this.maxStack.push(num)
        if (num <= this.getMin()) this.minStack.push(num)
    }
    pop() {
        let num = this.stack.pop();
        if (num === this.getMax()) this.maxStack.pop()
        if (num === this.getMin()) this.minStack.pop()
        return num
    }
}

let mms = new MinMaxStack();
let tst = [2, 3, 1, 4, 3, 4]
tst.forEach(num => mms.push(num))
console.log(mms.getMax())
console.log(mms.getMin())
console.log(mms.pop())
console.log(mms.getMax())
console.log(mms.getMin())
console.log(mms.pop())
console.log(mms.pop())
console.log(mms.pop())
console.log(mms.getMax())

console.log(mms.getMin())
console.log(mms.pop())
console.log(mms.getMin())
console.log(mms.pop())