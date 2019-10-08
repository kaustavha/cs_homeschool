
/**
Theorem interview

example word:  "cat"
board:  [ 'a', 'z', 'c', 't', 'v', 'a' ]

best order (move and the state of the board after the move):

[ 'a', 'z', 'c', 't', 'v', 'a' ]
LEFT       => [ 'z', 'c', 't', 'v', 'a', 'a' ]
LEFT       => [ 'c', 't', 'v', 'a', 'a', 'z' ]
LEFT  "c"  => [ 't', 'v', 'a', 'a', 'z' ]
RIGHT      => [ 'z', 't', 'v', 'a', 'a' ]
RIGHT "a"  => [ 'z', 't', 'v', 'a' ]
LEFT       => [ 't', 'v', 'a', 'z' ]
LEFT  "t"  => [ 'v', 'a', 'z' ]

Result:

LEFT:nil, LEFT:nil, LEFT:c, RIGHT:nil, RIGHT:a, LEFT:nil, LEFT:t

f(board, word) => moves

2nd example word: "tv"
2nd board:  [ 'a', 'z', 'c', 't', 'v', 'a' ]

Result:
RIGHT:nil, RIGHT:nil, RIGHT:t, LEFT:v
**/

/**
- valid letters = word[0]
- find side w/ closest valid letter
- pop off till we get to letter, adding to other side
-
**/

function main(word = '', board = []) {
    let searchArr = word.split('');

    function search(wordArr, searchArrIter, result) {
        if (searchArrIter >= searchArr.length) return result;

        let char = searchArr[searchArrIter],
            lastFound = wordArr.lastIndexOf(char),
            firstFound = wordArr.indexOf(char);

        if (wordArr.length - lastFound <= firstFound) {
            return goLeft(wordArr, char, searchArrIter, result);
        } else {
            return goRight(wordArr, char, searchArrIter, result);
        }
    }

    function goLeft(wordArr, char, i, result) {
        let iter = wordArr.length - 1, left = [];
        while (wordArr[iter] !== char) {
            left.unshift(wordArr[iter]);
            result.push({ 'RIGHT': null })
            iter--;
        }
        result.push({ 'RIGHT': char })
        wordArr = wordArr.slice(0, iter);
        wordArr = left.concat(wordArr);

        return search(wordArr, i + 1, result)
    }

    function goRight(wordArr, char, i, result) {
        let iter = 0, right = [];
        while (wordArr[iter] !== char) {
            right.push(wordArr[iter]);
            result.push({ 'LEFT': null })
            iter++;
        }
        iter++;
        result.push({ 'LEFT': char });
        wordArr = wordArr.slice(iter, wordArr.length);
        wordArr = wordArr.concat(right);
        return search(wordArr, i + 1, result)
    }

    return search(board, 0, []);
}

console.log(main('cat', ['a', 'z', 'c', 't', 'v', 'a']))
console.log(main("tv",  [ 'a', 'z', 'c', 't', 'v', 'a' ]))
