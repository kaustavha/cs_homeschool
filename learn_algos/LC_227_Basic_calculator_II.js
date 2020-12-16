/**
Given a string s which represents an expression, evaluate this expression and return its value. 

The integer division should truncate toward zero.

 

Example 1:

Input: s = "3+2*2"
Output: 7
Example 2:

Input: s = " 3/2 "
Output: 1
Example 3:

Input: s = " 3+5 / 2 "
Output: 5
**/

/**
 * @param {string} s
 * @return {number}
 */
var calculate = function(s) {
    function isNumeric(s) {
        return !isNaN(s - parseFloat(s));
    }
    let stack = [];
    let postOpTotal = 0;
    let curNum = 0;
    let lastNum = 0;
    let sign = '+';
    s = s.split(" ").join('');
    for (let i=0; i<s.length+1; i++) {
        let curChar = s[i];
        if (isNumeric(curChar)) {
            curNum = (curNum * 10) + (parseInt(curChar));
        } else {
            // check ops
            if (sign == '+') {
                stack.push(curNum);
            }else if (sign == '-') {
                stack.push(-curNum);
            } else if (sign == '*') {
                lastNum = stack.pop();
                stack.push(lastNum * curNum);
            } else if (sign == '/') {
                lastNum = stack.pop();
                if (lastNum > 0) {
                    stack.push(Math.floor(lastNum / curNum));
                } else {
                    stack.push(Math.floor((lastNum*-1) / curNum)*-1)
                }
            }
            sign = curChar;
            curNum = 0;
        }
    }
    
    let result = 0;
    while (stack.length > 0) {
        result += stack.pop();
    }
    return result;
};
