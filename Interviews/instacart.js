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
// process.stdin.resume();
// process.stdin.setEncoding("ascii");
// var input = "";
// process.stdin.on("data", function (chunk) {
//     input += chunk;
// });
// process.stdin.on("end", function () {
//     // now we can read/parse input
//     function scanLineForSame(textLine) {
//         let textArr = textLine.split(' ');
//         let seenMap = {}, seenRes = {};
//         textArr.forEach(char => {
//             if (seenRes[char]) {
//                 if (seenRes[char].length < 3) seenRes[char].push(char);
//             } else {
//                 seenRes[char] = [char];
//             }
//         });
//         let out = [];
//         Object.values(seenRes).forEach(list => {
//             if (list.length == 3) out = list;
//         });
//         return out.join(' ');
//     }
    
//     function scanLineForDifferent(textLine) {
//         let textArr = textLine.split(' '), seenMap={}, list = [];
//         textArr.forEach(char => {
//             if (list.length == 3) return;
//             if (!seenMap[char]) {
//                 seenMap[char] = true;
//                 list.push(char);
//             }
//         });
//         return list.join(' ')
//     }
    
//     let sameHand = scanLineForSame(input);
//     let uniqHand = scanLineForDifferent(input);
//     sameHand.length > 0 ? console.log(sameHand) : console.log(uniqHand);
// });

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
// process.stdin.resume();
// process.stdin.setEncoding("ascii");
// var input = "";
// process.stdin.on("data", function (chunk) {
//     input += chunk;
// });
// process.stdin.on("end", function () {
    // now we can read/parse input


    // new strat 
    // pre process
    // map nums in char : [chars]
    // map chars[0] : num
    // func uniq array[chars of same length] => return unique set if l=3
    // func same array[chars of same length] => return same set if l=3
    // same char diff lengs => charMap.forEach numList => uniq(numList)
    // same char same lengths => numMap.forEach charArr => same(charArr)
    // diff char same lens => numMap.forEach charArr => uniq(charArr)
    // diff char diff lens => numMaps.forEach recursively check if we can form a list with other items in the numMap then run scanLineForUniq on each possibiltiy and return succ match 

function scanLineForSame(textArr) {
    let seenRes = {}, outList = [];
    textArr.forEach(char => {
        if (seenRes[char]) {
            if (seenRes[char].length < 3) seenRes[char].push(char);
        } else {
            seenRes[char] = [char];
        }
    });
    Object.values(seenRes).forEach(list => {
        if (list.length == 3) {
            outList = list;
            return;
        }
    });
    return outList;
}

function scanLineForDifferent(textArr) {
    let seenMap={}, list = [];
    textArr.forEach(char => {
        if (list.length == 3) return list;
        if (!seenMap[char]) {
            seenMap[char] = true;
            list.push(char);
        }
    });
    return list;
}

function createCharMap(textArr) {
    let outCharMap = {}, outNumMap = {}, charNameToChar = {}, occurences = {};
    textArr.forEach(txt => {
        let length = txt.length;
        let charName = txt.split('')[0];
        if (!outCharMap[charName]) outCharMap[charName] = [];
        outCharMap[charName].push(length);

        if (!outNumMap[length]) outNumMap[length] = [];
        outNumMap[length].push(txt);

        if (!charNameToChar[charName]) charNameToChar[charName] = [];
        charNameToChar[charName].push(txt);

        if (!occurences[txt]) occurences[txt] = [];
    });
    return {
        numMap: outNumMap,
        charMap: outCharMap,
        charNameToChar: charNameToChar
    }
}

function samesame(numMap) {
    for (let key in numMap) {
        let charArr = numMap[key];
        let same = scanLineForSame(charArr);
        if (same && same.length == 3) {
            return same;
        }
    }
    return [];
}

function diffCharSameLen(numMap) {
    for (let key in numMap) {
        let samelen = scanLineForDifferent(numMap[key]);
        if (samelen.length == 3) return samelen;
    }
    return [];
}

function sameCharDiffLens(charMap, charNameToChar) {
    for (let key in charMap) {
        let numArr = charMap[key];
        let diff = scanLineForDifferent(numArr);
        if (diff && diff.length == 3) {
            return scanLineForDifferent(charNameToChar[key]);
        }
    }
    return [];
}

function diffdiff(numMap) {
    // for every set in nummap we start dfs 
    let out = [];
    for (let key in numMap) {
        let uniq = _findUniq(numMap[key]);
        uniq.forEach(match => {
            let newOutSet = [],
            newSeenNums = [],
            newSeencharNames = [];
            newOutSet.push(match);
            newSeenNums.push(key);
            newSeencharNames.push(match[0])
            let res = _dfs(numMap, newOutSet, newSeenNums, newSeencharNames);
            if (res.length === 3) {
                out = res;
                return out;
            }
        });
    }

    // Given txtArr, an array of equal length strings of the same chars, find all chars that arent in the seencharNames set
    function _findUniq(txtArr=[], seencharNames=[]) {
        let out = [], seenChars = [];
        txtArr.forEach(chars => {
            let charName = chars[0];
            if (seenChars.indexOf(chars) == -1 && seencharNames.indexOf(charName) == -1) {
                out.push(chars);
                seenChars.push(chars);
            }
        })
        return out;
    }

    function _dfs(numMap, outSetChars=[], seenNums, seencharNames) {
        if (outSetChars.length == 3) return outSetChars;
        if (seenNums.length == numMap.length) return [];

        for (let key in numMap) {
            if (seenNums.indexOf(key) == -1) {
                let possibileMatches = _findUniq(numMap[key], seencharNames);
                possibileMatches.forEach(match => {
                    let newOutSet = new Array().concat(outSetChars),
                        newSeenNums = new Array().concat(seenNums),
                        newSeencharNames = new Array().concat(seencharNames);
                    newOutSet.push(match);
                    newSeenNums.push(key);
                    newSeencharNames.push(match[0]);

                    let res = _dfs(numMap, newOutSet, newSeenNums, newSeencharNames);
                    if (res.length == 3) {
                        outSetChars = res;
                        return;
                    }
                });
            }
        }
        return outSetChars;
    }

    return out;
}


// Test case 0 - same same
// Input: A O UU UU UU
// Output: UU UU UU
test('A O UU UU UU')

// Test case 1 - same char diff len
// Input: A A O AA AAA
// Output: A AA AAA
test('A A O AA AAA')


// Test case 2 - same len diff char
// Input: AAA AAA O OOO U UUU
// Output: AAA OOO UUU
test("AAA AAA O OOO U UUU")


// Test case 3
// Input: A AA OO OOO U
// Output: AA OOO U
// diff diff is correct
test("A AA OO OOO U")


function test(inStr) {
    console.log('input : ', inStr)
    let inArr = inStr.split(' ');
    let {charMap, numMap,charNameToChar} = createCharMap(inArr);
    let results = [{
        name: 'same len & char',
        res: samesame(numMap)
    },{
        name: 'Diff len & same char',
        res: sameCharDiffLens(charMap, charNameToChar)
    },{
        name: 'Same len & diff char',
        res: diffCharSameLen(numMap)
    },{
        name: 'Diff len & char',
        res: diffdiff(numMap)
    }]
    results.filter(result => {
        if (result.res.length === 3) {
            console.log(`Output: ${result.name} - ${result.res}`)
        }
    });
    console.log('done \n\n')
}




// // old

//     function scanLineForSamePatternAndSameLength(textLine) {
//         let textArr = textLine.split(' ');
//         let seenMap = {}, seenRes = {};
//         textArr.forEach(char => {
//             if (seenRes[char]) {
//                 if (seenRes[char].length < 3) seenRes[char].push(char);
//             } else {
//                 seenRes[char] = [char];
//             }
//         });
//         let out = [];
//         Object.values(seenRes).forEach(list => {
//             if (list.length == 3) out = list;
//         });
//         return out.join(' ');
//     }
    
//      function scanLineForSamePatternAndUniqueLength(textLine) {
//         let textArr = textLine.split(' ');
//         let seenMap = {}, seenRes = {};
//         textArr.forEach(char => {
//             let length = char.length;
//             charName = char.split('')[0];
//             if (seenRes[charName] && seenMap[charName].indexOf(length) < 0) {
//                 if (seenRes[charName].length < 3) {
//                     seenRes[charName].push(char);
//                     seenMap[charName].push(length);
//                 }
//             } else {
//                 seenMap[charName] = [length];
//                 seenRes[charName] = [char];
//             }
//         });
//         let out = [];
//         Object.values(seenRes).forEach(list => {
//             if (list.length == 3) out = list;
//         });
//         return out.join(' ');
//     }
    
//     function scanLineForDifferentWithSameLength(textLine) {
//         let textArr = textLine.split(' ');
//         let seenMap = {}, seenRes ={}, seenLengths = [], list = [];
//         textArr.forEach(char => {
//             let length = char.length;
//             charName = char.split('')[0];
//             if (!seenMap[char] && seenLengths.indexOf(length) > -1) {
//                 if (!seenRes[length]) seenRes[length] = [];
//                 seenRes[length].push(char);
//                 if (seenRes[length].length == 3) return;
//             }
//         });
//         let out = [];
//         Object.values(seenRes).forEach(list => {
//             if (list.length == 3) out = list;
//         });
//         return out.join(' ');
//     }
    
    
//     function scanLineForDifferentWithUniqLengths(textLine) {
//         let textArr = textLine.split(' '), seenMap={}, list = [], seenLengths = [];
//         textArr.forEach(char => {
//             let length = char.length;
//             charName = char.split('')[0];
//             if (list.length == 3) return;
//             if (!seenMap[charName] && seenLengths.indexOf(length) == -1) {
//                 // console.log(seenMap, seenLengths, char)
//                 seenMap[charName] = true;
//                 seenLengths.push(length);
//                 list.push(char);
//             }
//         });
//         if (list.length === 3) return list.join(' ');
//         return '';
//     }
// function old () {
//     // new strat 
//     // pre process
//     // map nums in char : [chars]
//     // map chars[0] : num
//     // func uniq array[chars of same length] => return unique set if l=3
//     // func same array[chars of same length] => return same set if l=3
//     // same char diff lengs => charMap.forEach numList => uniq(numList)
//     // same char same lengths => numMap.forEach charArr => same(charArr)
//     // diff char same lens => numMap.forEach charArr => uniq(charArr)
//     // diff char diff lens => numMaps.forEach recursively check if we can form a list with other items in the numMap then run scanLineForUniq on each possibiltiy and return succ match 

//     // let sameHand = scanLineForSame(input);
//     let uniqHand = scanLineForDifferentWithUniqLengths(input);
//     let sameHandSameNum = scanLineForSamePatternAndSameLength(input);
//     let sameHandUniqNum = scanLineForSamePatternAndUniqueLength(input);
//     let uniqHandSameNum = scanLineForDifferentWithSameLength(input);
//     let logout;
//     // let uniqHand = '';
//     if (uniqHand.length > 0) {
//         logout = uniqHand;
//     console.log('uniqHand',logout)
//     } else if (sameHandSameNum.length > 0) {
//         logout = sameHandSameNum;
//     console.log('sameHandSameNum', logout)
//     } else if (sameHandUniqNum.length > 0) {
//         logout = sameHandUniqNum;
//     console.log('sameHandUniqNum', logout)
//     } else if (uniqHandSameNum.length > 0) {
//         logout = uniqHandSameNum;
//     console.log('uniqHandSameNum', logout)
//     }
//     console.log(logout)
//     // sameHand.length > 0 ? console.log(sameHand) : console.log(uniqHand);
// // });
// }

// // next step q3 -> add a prefix to the array so its 3 uniq things to filter on instead of 2 e.g. *AAA &UUU