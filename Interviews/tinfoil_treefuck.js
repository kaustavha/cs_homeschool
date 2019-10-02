// Installed npm packages: jquery underscore request express
// jade shelljs passport http sys lodash async mocha chai sinon
// sinon-chai moment connect validator restify ejs ws co when
// helmet wrench brain mustache should backbone forever debug jsdom

/* 
Your last Bash code is saved below:

Implement the programming language Treefuck, which is based on Brainfuck (another language).

You should write an interpreter (takes in a program as a string and execute it)
and implement any necessary underlying data structure(s).

The language consists of nine commands, listed below. A Treefuck program is
a sequence of these commands, possibly interspersed with other
characters (which are ignored). The commands are executed sequentially, with
some exceptions: an instruction pointer begins at the first command, and each
command it points to is executed, after which it normally moves forward to
the next command. The program terminates when the instruction pointer moves
past the last command.

The Treefuck language uses a simple machine model consisting of the program
and instruction pointer, as well as an infinitely large binary tree, with each
node initialized to zero.

Commands:
< -> Move the data pointer to point to the left subtree of the current node
> -> Move the data pointer to point to the right subtree of the current node
| -> Move the data pointer to point to the parent of the current node
+ -> Increment the byte stored in the current node
- -> Decrement the byte stored in the current node
. -> Output the byte stored in the current node to stdout
, -> Read one byte of input from stdin, and store it in the current node
[ -> If the current node's value is zero, jump the instruction pointer to the command after the matching ]. Otherwise continue
] -> If the current node's value is not zero, jump the instruction pointer to the command after the matching [. Otherwise continue

Examples
Read a byte as input, then count down from that byte, outputting each number
,[.-]
Read two bytes as input, then output their sum
<,|>,|<[-|+<]|>[-|+>]|.
Print "Hello World!"
++++++++[>++++[>++>+++>+++>+||||-]>+>+>->>+[|]|-]>>.>---.+++++++..+++.>>.|-.|.+++.------.--------.>>+.>++.

 */

var readline = function() {return 4;};
let debug = false;

class Node {
    constructor(val) {
        this.val = val || 0;
        this.left = null;
        this.right = null;
        this.parent = null;
    }
}

class Treefuck {
    constructor() {
        this.root = new Node();
        this.ptr = this.root;
    }
    handleEmpty() {
        if (this.ptr.left == null) {
            this.ptr.left = new Node();
        }
        if (this.ptr.right == null) {
            this.ptr.right = new Node();
        }
    }
    execute(str) {
        if (debug) console.log('starting exec');
        for (let i=0;i<str.length;i++) {
            let c = str[i];
            if (c == '<') {
                this.goleft();
            } else if (c == '>') {
                this.goRight();
            } else if (c== '|') {
                this.goToParent();
            } else if (c=='[') {
                if (this.ptr.val == 0) {
                    let k =i,
                        seenBrackets = 0,found=false;
                    while (!found) {
                        k++;
                        if (k>=str.length && debug) console.log('error, no matching bracket found');
                        let thisChar = str[k];
                        if (thisChar == '[') {
                            seenBrackets++;
                        }
                        if (thisChar == ']') {
                            if (seenBrackets == 0) {
                                found = true;
                                break;
                            } else {
                                seenBrackets--;
                            }
                        }
                    }
                    i = k;
                    if (debug) console.log('found match'); // 2
                    if (debug) console.log(str[i-1] + i + str[i+1]);
                }
            } else if (c==']') {
                if (this.ptr.val != 0) {
                    let k =i,
                        seenBrackets=0,found=false;
                    while (!found) {
                        k--;
                        if (k<=0 && debug) console.log('error, no matching bracket found');
                        let thisChar = str[k];
                        if (thisChar == '[') {
                            if (seenBrackets == 0) {
                                found = true;
                                break;
                            } else {
                                seenBrackets--;
                            }
                        } else if (thisChar == ']') {
                            seenBrackets++;
                        }
                    }
                    i=k;
                    if (debug) console.log(str[i-1] + i + str[i+1]);
                }
            } else if (c=='+') {
                this.increment();
            } else if (c=='-') {
                this.decrement();
            } else if (c=='.') {
                this.output()
            } else if (c==',') {
                this.input();
            } else {
                throw 'invalid syntax';
            }
        }
    }
    goleft() {
        this.handleEmpty();
        let nextPtr = this.ptr.left;
        nextPtr.parent = this.ptr;
        this.ptr = nextPtr;
    }
    goRight() {
        this.handleEmpty();
        let nextPtr = this.ptr.right;
        nextPtr.parent = this.ptr;
        this.ptr = nextPtr;      
    }
    goToParent() {
        if (this.ptr.parent == null) {
            if (debug) console.log('this is the root');
        }
        this.ptr = this.ptr.parent;
    }
    increment() {
        this.ptr.val++;
    }
    decrement() {
        if (this.ptr.val <= 0){
            if (debug) console.log('cant have -ve bytes');
            this.output();
        }
        this.ptr.val--;
    }
    output() {
        let intofchar = parseInt(this.ptr.val),
            letter = String.fromCharCode(intofchar),
            out = `${letter} | ${intofchar}`;
        console.log(out);
    }
    input() {
        this.ptr.val = readline();
    }
}


let instr= ",[.-]";
let tf = new Treefuck();
tf.execute(instr);
tf = new Treefuck();
tf.execute('<,|>,|<[-|+<]|>[-|+>]|.');

tf = new Treefuck();
tf.execute("++++++++[>++++[>++>+++>+++>+||||-]>+>+>->>+[|]|-]>>.>---.+++++++..+++.>>.|-.|.+++.------.--------.>>+.>++.");
// prints hello world