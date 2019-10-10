// cardgame
/**
 * Card game - Step 1
 

You have a set of cards where each “card” is represented by a letter — A, O, or U. Your task is to find a hand of 3 cards that are all the same or all different.

 

Specifications

– You only need to find one hand
– The cards will be read from STDIN, space separated
– The hand should be printed to STDOUT, space separated (trailing space is ok)
– The cards can be output in any order
– You don't need to optimize for time or space complexity

– Use the "Run Tests" button to check solution

 

Test cases
 

Test case 0 - all same
Input: O U O U O
Expected output: O O O

 

Test case 1 - all different
Input: A A O O U
Expected output: A O U

 
 */
process.stdin.resume();
process.stdin.setEncoding("ascii");
var input = "";
process.stdin.on("data", function (chunk) {
    input += chunk;
});
process.stdin.on("end", function () {
    // now we can read/parse input
    function scanLineForSame(textLine) {
        let textArr = textLine.split(' ');
        let seenMap = {}, seenRes = {};
        textArr.forEach(char => {
            if (seenRes[char]) {
                if (seenRes[char].length < 3) seenRes[char].push(char);
            } else {
                seenRes[char] = [char];
            }
        });
        let out = [];
        Object.values(seenRes).forEach(list => {
            if (list.length == 3) out = list;
        });
        return out.join(' ');
    }
    
    function scanLineForDifferent(textLine) {
        let textArr = textLine.split(' '), seenMap={}, list = [];
        textArr.forEach(char => {
            if (list.length == 3) return;
            if (!seenMap[char]) {
                seenMap[char] = true;
                list.push(char);
            }
        });
        return list.join(' ')
    }
    
    let sameHand = scanLineForSame(input);
    let uniqHand = scanLineForDifferent(input);
    sameHand.length > 0 ? console.log(sameHand) : console.log(uniqHand);
});

/**
 * Card game - Step 2
 

In this variant of the game a card consists of two properties:

1. The letter — A, O, or U

2. The length — 1, 2, or 3 (eg A, AA, AAA)

 

We want to find 3 cards that have
1. all the same letter or all different letters
AND
2. all the same length or all different lengths

 

In visual form we can see there are 4 valid combinations:



 

Note — you may need a different approach than last time

 

Test cases
 

Test case 0

Input: A O UU UU UU
Output: UU UU UU

 

Test case 1
Input: A A O AA AAA
Output: A AA AAA

 

Test case 2
Input: AAA AAA O OOO U UUU
Output: AAA OOO UUU

 

Test case 3
Input: A AA OO OOO U
Output: AA OOO U
 */
process.stdin.resume();
process.stdin.setEncoding("ascii");
var input = "";
process.stdin.on("data", function (chunk) {
    input += chunk;
});
process.stdin.on("end", function () {
    // now we can read/parse input
    function scanLineForSamePatternAndSameLength(textLine) {
        let textArr = textLine.split(' ');
        let seenMap = {}, seenRes = {};
        textArr.forEach(char => {
            if (seenRes[char]) {
                if (seenRes[char].length < 3) seenRes[char].push(char);
            } else {
                seenRes[char] = [char];
            }
        });
        let out = [];
        Object.values(seenRes).forEach(list => {
            if (list.length == 3) out = list;
        });
        return out.join(' ');
    }
    
     function scanLineForSamePatternAndUniqueLength(textLine) {
        let textArr = textLine.split(' ');
        let seenMap = {}, seenRes = {};
        textArr.forEach(char => {
            let length = char.length;
            charName = char.split('')[0];
            if (seenRes[charName] && seenMap[charName].indexOf(length) < 0) {
                if (seenRes[charName].length < 3) {
                    seenRes[charName].push(char);
                    seenMap[charName].push(length);
                }
            } else {
                seenMap[charName] = [length];
                seenRes[charName] = [char];
            }
        });
        let out = [];
        Object.values(seenRes).forEach(list => {
            if (list.length == 3) out = list;
        });
        return out.join(' ');
    }
    
    function scanLineForDifferentWithSameLength(textLine) {
        let textArr = textLine.split(' ');
        let seenMap = {}, seenRes ={}, seenLengths = [], list = [];
        textArr.forEach(char => {
            let length = char.length;
            charName = char.split('')[0];
            if (!seenMap[char] && seenLengths.indexOf(length) > -1) {
                if (!seenRes[length]) seenRes[length] = [];
                seenRes[length].push(char);
                if (seenRes[length].length == 3) return;
            }
        });
        let out = [];
        Object.values(seenRes).forEach(list => {
            if (list.length == 3) out = list;
        });
        return out.join(' ');
    }
    
    
    function scanLineForDifferentWithUniqLengths(textLine) {
        let textArr = textLine.split(' '), seenMap={}, list = [], seenLengths = [];
        textArr.forEach(char => {
            let length = char.length;
            charName = char.split('')[0];
            if (list.length == 3) return;
            if (!seenMap[charName] && seenLengths.indexOf(length) == -1) {
                // console.log(seenMap, seenLengths, char)
                seenMap[charName] = true;
                seenLengths.push(length);
                list.push(char);
            }
        });
        if (list.length === 3) return list.join(' ');
        return '';
    }
    
    // let sameHand = scanLineForSame(input);
    let uniqHand = scanLineForDifferentWithUniqLengths(input);
    let sameHandSameNum = scanLineForSamePatternAndSameLength(input);
    let sameHandUniqNum = scanLineForSamePatternAndUniqueLength(input);
    let uniqHandSameNum = scanLineForDifferentWithSameLength(input);
    let logout;
    // let uniqHand = '';
    if (uniqHand.length > 0) {
        logout = uniqHand;
    console.log('uniqHand',logout)
    } else if (sameHandSameNum.length > 0) {
        logout = sameHandSameNum;
    console.log('sameHandSameNum', logout)
    } else if (sameHandUniqNum.length > 0) {
        logout = sameHandUniqNum;
    console.log('sameHandUniqNum', logout)
    } else if (uniqHandSameNum.length > 0) {
        logout = uniqHandSameNum;
    console.log('uniqHandSameNum', logout)
    }
    console.log(logout)
    // sameHand.length > 0 ? console.log(sameHand) : console.log(uniqHand);
});