
// https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Telephone-keypad2.svg/200px-Telephone-keypad2.svg.png
// Input: '23'
// Output: ['ad', 'ae', 'af', 'bd', 'be', 'bf', 'cd', 'ce', 'cf']

// Input: '9999'
// Output: ['wwww', 'wwwx', ... ,'zzzz']

// skip 1s and 0s 
// check edge 1s and 0s are at end or start

// replicate a phone number keypad
// Input: '23'
// Output: ['ad', 'ae', 'af', 'bd', 'be', 'bf', 'cd', 'ce', 'cf']
// n = 2
// 9
// n = 3
// 27

// Input: '9999'
// Output: ['wwww', 'wwwx', ... ,'zzzz']

// skip 1s and 0s 
// check edge 1s and 0s are at end or start

function numPadSelection(number) {
    const numpadMap = {
        2: ['a', 'b', 'c'],
        3: ['d', 'e', 'f'],
        // ...
    }
    if (!number) return [];
    let numArr = number.split('');
    let output = [];

    function _generate(numArr, i, resultSoFar) {
        let cur = numArr[i];
        if (numArr.length == resultSoFar.length || !numArr.length) return output.push(resultSoFar);
        if (cur == 0 || cur == 1) {
            numArr.splice(i, 1);
            return _generate(numArr, i, resultSoFar);
        } else {
            i++;
            numpadMap[cur].forEach((letter) => {
                _generate(numArr, i, resultSoFar + letter);
            });
        }
    }

    _generate(numArr, 0, '');
    return output;
}

console.log(numPadSelection('23'))

console.log(numPadSelection(''))
console.log(numPadSelection())
console.log(numPadSelection('0'))
console.log(numPadSelection('23'))
console.log(numPadSelection('023'))
console.log(numPadSelection('2301'))
console.log(numPadSelection('211103'))
console.log(numPadSelection('020300'))
console.log(numPadSelection('99999999999'))

// console.log(numPadSelection('kkkkafafa**9'))
console.log(numPadSelection('999999999999999999999999999999999'))
/**
 * Space complexity is b^m - branching factor (3-4 per num) ^ (input length)
 * Time complexity is n*m ?
 */
