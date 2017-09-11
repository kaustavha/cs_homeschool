// stack
class LIFO {
    constructor() {
        let store = [];
    }
    add() {
        store.push();
    }
    pop() {
        store.splice(-1, 1);

    }
    peek() {
        return store[store.length - 1];
    }
    isEmpty() {
        return (store.length == 0);
    }
}

class FIFO {
    constructor() {
        let store = [];
    }
    add() {
        store.push();
    }
    pop() {
        store.splice(0, 1);

    }
    peek() {
        return store[store.length - 1];
    }
    isEmpty() {
        return (store.length == 0);
    }
}

class StackNode {
    constructor(){
        this.data = data;
        this.next = new StackNode();
    }
}

class Stack {
    constructor() {
        this.top = new StackNode();
    }

    EmptyStackException() {

    }

    pop() {
        if (top == null) throw new EmptyStackException();
    }


}