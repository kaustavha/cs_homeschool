function RPN(str) {
    function isActionChar(char) {
        if (char == '+' ||
            char == '-' ||
            char == '*' ||
            char == '/' ||
            char == 'abs') return true;
        return false;
    }

    function doAction(stack, char) {
        let res, y, x = parseInt(stack.pop());
        if (char == 'abs') {
            res = Math.abs(x);
        } else {
            y = parseInt(stack.pop());
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

    let stack = [], arr = str.split(' ');

    arr.forEach(cur => {
        if (!isActionChar(cur)) {
            stack.push(cur);
        } else {
            stack = doAction(stack, cur);
        }
    })

    return stack[0];
}

let testCases = [
    '2 5 +',
    '1 30 -',
    '3 6 * 2 /',
    '3 4 2 * -',
    '10 9 8 7 - + +',
    '1',
    '2 5 - abs',
    '-'
];

testCases.forEach(el => {
    console.log(RPN(el))
})
