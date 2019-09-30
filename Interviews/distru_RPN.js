function RPN(str) {
    let stack = [], arr = [];

    function parseInput(str) {
        let arr = str.split(' '), res = [];
        arr.forEach(element => {
            if (!isActionChar(element)) {
                res.push(parseInt(element))
            } else {
                res.push(element);
            }
        });
        return res;
    }

    arr = parseInput(str)

    function isActionChar(char) {
        if (char == '+' ||
            char == '-' ||
            char == '*' ||
            char == '/' ||
            char == 'abs') return true;
        return false;
    }

    function doAction(stack, char) {
        let res, y, x = stack.pop();
        if (char == 'abs') {
            res = Math.abs(x);
        } else {
            y = stack.pop();
            if (char == '+') {
                res = x+y;
            } else if (char == '-') {
                res = y-x;
            } else if (char == '*' ) {
                res = y*x;
            } else if (char == '/') {
                res = y/x;
            }
        }

        stack.push(res);

        return stack;
    }

    for (let i=0; i<arr.length; i++ ) {
        let cur = arr[i];
        if (!isActionChar(cur)) {
            stack.push(cur);
        } else {
            // if (cur === 'abs') {
            //     let x = stack.
            // }
            // let x = stack.pop(),
            //     y = stack.pop();
            stack = doAction(stack, cur);
            // stack.push(res)
        }
    }

    return stack[0];
}

let testCases = [
    '2 5 +',
    '1 30 -',
    '3 6 * 2 /',
    '3 4 2 * -',
    '10 9 8 7 - + +',
    '1',
    '2 5 - abs'
];

testCases.forEach(el => {
    console.log(RPN(el))
})