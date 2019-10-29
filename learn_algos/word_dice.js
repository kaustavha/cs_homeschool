/**
 * Given a word of length n and n six-sided dice with a character in each side. Find out if this word can be constructed by the set of given dice.

Example 1:

Input:
word = "hello"
dice = [[a, l, c, d, e, f], [a, b, c, d, e, f], [a, b, c, h, e, f], [a, b, c, d, o, f], [a, b, c, l, e, f]]
Output: true
Explanation: dice[2][3] + dice[1][4] + dice[0][1] + dice[4][3] + dice[3][4]
Example 2:

Input:
word = "hello"
dice = [[a, b, c, d, e, f], [a, b, c, d, e, f], [a, b, c, d, e, f], [a, b, c, d, e, f], [a, b, c, d, e, f]]
Output: false
Example 3:

Input:
word = "aaaa"
dice = [[a, a, a, a, a, a], [b, b, b, b, b, b], [a, b, c, d, e, f], [a, b, c, d, e, f]]
Output: false

*/


 // brute force depth first search - exit on first found link O(n!)
function isWordPossible(word, dices) {
    let foundWord = false;

    const dfs = (dices, seenDices, chars) => {
        if (chars.length === 0) {
            foundWord = true;
            return true;
        }
        if (seenDices.length === dices.length) return;

        dices.some((dice, i) => {
            if (seenDices.indexOf(i) === -1) {
                dice.some(char => {
                    if (chars.indexOf(char) > -1) {
                        let newChars = [...chars];
                        newChars.splice(newChars.indexOf(char), 1);
                        let newSeenDices = [...seenDices];
                        newSeenDices.push(i);
                        if (dfs(dices, newSeenDices, newChars)) return true;
                    }
                })
            }
        })
    }

    dfs(dices, [], word.split(''));
    return foundWord;
}

let res;

res = isWordPossible( "hello", [
    ['a', 'l', 'c', 'd', 'e', 'f'],
    ['a', 'b', 'c', 'd', 'e', 'f'],
    ['a', 'b', 'c', 'h', 'e', 'f'],
    ['a', 'b', 'c', 'd', 'o', 'f'],
    ['a', 'b', 'c', 'l', 'e', 'f']
])
console.log(res)

res = isWordPossible("hello",[
    ['a', 'b', 'c', 'd', 'e', 'f'],
    ['a', 'b', 'c', 'd', 'e', 'f'],
    ['a', 'b', 'c', 'd', 'e', 'f'],
    ['a', 'b', 'c', 'd', 'e', 'f'],
    ['a', 'b', 'c', 'd', 'e', 'f']
])
console.log(res)

res = isWordPossible("aaaa", [
    ['a', 'a', 'a', 'a', 'a','a'],
    ['b', 'b', 'b', 'b','b', 'b'],
    ['a', 'b', 'c','d', 'e', 'f'],
    ['a', 'b','c', 'd', 'e', 'f']
])
console.log(res)