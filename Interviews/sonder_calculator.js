
// Implement a basic calculator to evaluate a simple expression string.
// The expression string contains only non-negative integers, +, -, *, / operators and empty spaces.
// The integer division should truncate toward zero.
// Note: You cannot use regex.
// Example 1:
// Input: "3+2*2"
// Output: 7
//
// Example 2:
// Input: " 3/2 "
// Output: 1
// Example 3:
// Input: "  3 + 5 / 2 "
// Output: 5

// D M A S 
//2nd attempt - TODO

function calc(inStr) {
    let buf = '';
    let res = 0;

    const mult = (a, b) => a*b;
    const add = (a,b) => a+b;

    const multer = (op,a,b) => {

    }

    const compactor = (op, a, b) => {
        let res = 0;
        switch (op) {
            case '-':
                b = parseInt(op+'1') * b;
            case '+':
                res = a+b;
                break;
        }


        if (op === '/') {
            res = mult(a,b)
        } else if (op === '*') {
            res = res*b
        }
    }

    const isOp = (char) => isNaN(parseInt(char))

    inStr.trim().split('').filter(char => char !== ' ').map((ele, i, arr) => {
        // get num at each op or at end 
        if (isOp(arr[i+1]) || i === ele.length - 1) {
            let res = parseInt(buf);
            buf = ''
            return res;
        }
        if (isOp(ele)) return ele;
        buf += ele;
    }).map((ele, i, arr) => {
        if (isOp(arr[i+1])  || i === ele.length - 1) {
            if (arr[i+1] === '/' || arr[i+1] === '*') {
                let a = ele,
                    b = arr[i+2];
                return 
            } else {
                return ele;
            }
        }
    });
}

// 1st attempt - PASS
function calculator(inStr) {
    // multi length digits
    if (!inStr || inStr.length === 0) return 0;
    let parsedStrArr = inStr.trim().split('').filter(char => char !== ' ');

    console.log(parsedStrArr);

    let fixedParsedStrArr = [];

    let numStr = '';
    for (let i = 0; i < parsedStrArr.length; i++) {
        let char = parsedStrArr[i];
        if (!isNaN(parseInt(char))) {
            numStr += char;
        } else {
            fixedParsedStrArr.push(numStr);
            numStr = '';
            fixedParsedStrArr.push(char);
        }
    }
    fixedParsedStrArr.push(numStr);

    console.log(fixedParsedStrArr)

    let dividedRes = [];

    for (let i = 0; i < fixedParsedStrArr.length; i++) {
        let char = fixedParsedStrArr[i];
        if (char === '/') {
            let a = dividedRes.pop(),
                b = fixedParsedStrArr[i + 1];

            a = parseInt(a);
            b = parseInt(b);
            dividedRes.push(Math.floor(a / b));
            i += 1;
        } else {
            dividedRes.push(char);
        }
    }
    console.log(dividedRes)

    let multipliedRes = [];

    for (let i = 0; i < dividedRes.length; i++) {
        let char = dividedRes[i];
        if (char === '*') {
            let a = multipliedRes.pop(),
                b = dividedRes[i + 1];
            a = parseInt(a);
            b = parseInt(b);
            multipliedRes.push(Math.floor(a * b));
            i += 1;
        } else {
            multipliedRes.push(char);
        }
    }


    console.log(multipliedRes)

    let addedRes = [];

    for (let i = 0; i < multipliedRes.length; i++) {
        let char = multipliedRes[i];
        if (char === '+') {
            let a = addedRes.pop(),
                b = multipliedRes[i + 1];
            a = parseInt(a);
            b = parseInt(b);
            addedRes.push(Math.floor(a + b));
            i += 1;
        } else {
            addedRes.push(char);
        }
    }

    console.log(addedRes)
    let subtractedRes = [];

    for (let i = 0; i < addedRes.length; i++) {
        let char = addedRes[i];
        if (char === '-') {
            let a = subtractedRes.pop(),
                b = multipliedRes[i + 1];
            a = parseInt(a);
            b = parseInt(b);
            subtractedRes.push(Math.floor(a - b));
            i += 1;
        } else {
            subtractedRes.push(char);
        }
    }

    return subtractedRes[0];
}

//console.log(calculator("3+2*2")); // 7
//console.log(calculator(" 3/2 ")); // 1
//console.log(calculator("  3 + 5 / 2 ")); // 5

//console.log(calculator("  3 + 5 * 2 ")); // 13
console.log(calculator("  3 + 10 * 2 ")); // 23
console.log(calculator(""));

