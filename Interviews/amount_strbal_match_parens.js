// String Balancing

// Part One

/*
Given a string of parentheses, check if the string is balanced.

i.e. `"()"` and `"(()())"` are both balanced, while `)(` is not.

The function signature is: `(str: string) => boolean;`
*/


function strBalance(str, openChar, closeChar) {
    if (str.length === 0) return true;
    let charArr = str.split('');
    let stack = 0;

    charArr.forEach(char => {
        if (char === openChar) stack += 1;
        if (stack > 0 && char === closeChar) stack--;
    })

    // console.log(stack)

    return stack === 0;
}

// console.log(strBalance('()'))

// console.log(strBalance("(()())"))

// console.log(strBalance(')('))

// console.log(strBalance(''))

/*
## Part Two
​
Given a string of parentheses, braces (`{}`) and brackets (`[]`), check if the string is balanced.
 
 
'[{()}]' => true
'[{(]})' => true
'{([)}' => false
 
*/

function strBalanceAllBrackets(str) {
    let resRound = strBalance(str, '(', ')');
    let resCurly = strBalance(str, '{', '}');
    let resSquare = strBalance(str, '[', ']');

    return resRound && resCurly && resSquare;

}

console.log(strBalanceAllBrackets('[{()}]'))
console.log(strBalanceAllBrackets('[{(]})'))
console.log(strBalanceAllBrackets('{([)}'))

/*
## Part Three
​
Write a function that takes pairs and returrns a function to check if a string is balanced.
```ts
pairs = [['(',')']]
```
array or arr of chars
*/

// strBalanced([['{','}'], ['(',')']])('()') => true

function getStrBalanceFunc(pairs) {
    return (str) => {
        if (pairs.length === 0) return true;

        let bool = strBalance(str, pairs[0][0], pairs[0][1]);

        for (let i = 1; i < pairs.length; i++) {
            // console.log(bool)
            if (i % 2 > 0 || i === pairs.length - 1) {
                // e.g. 1, 3 -- todo think about end
                bool = bool && strBalance(str, pairs[i][0], pairs[i][1]);
            }
        }

        return bool;
    }
}

let fn = getStrBalanceFunc([['(', ')'], ['[', ']']]);
console.log(fn)

console.log(fn('()'))
console.log(fn('()('))

console.log(fn('()[]'))
console.log(fn('()['))
