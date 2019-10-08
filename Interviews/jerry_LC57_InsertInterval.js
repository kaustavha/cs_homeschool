// Task: Implement a class named 'RangeList'
// A pair of integers define a range, for example: [1, 5). This range includes integers: 1, 2, 3, and 4.
// A range list is an aggregate of these ranges: [1, 5), [10, 11), [100, 201)

class RangeList {
    constructor() {
        this.ranges = [];
    }

    /**
     * Adds a range to the list
     * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
     */
    add(range) {
        let start = range[0],
            end = range[1],
            left = [],
            right = [];
        if (this.ranges.length === 0) {
            this.ranges.push(range);
            return;
        }
        this.ranges.forEach(storedRange => {
            let curStart = storedRange[0],
                curEnd = storedRange[1];
            if (curEnd < start) {
                left.push(storedRange);
            } else if (curStart > end) {
                right.push(storedRange);
            } else {
                start = Math.min(curStart, start);
                end = Math.max(curEnd, end);
            }
        });
        this.ranges = this._join(left, [start, end], right);
    }

    /**
     * Joins three arrays together. 
     * @param {Array} left array of range pairs
     * @param {Array} mid single range pair
     * @param {Array} right array of range pairs
     */
    _join(left, mid, right) {
        let ranges = left.concat([mid]);
        right.forEach(range => {
            ranges.push(range);
        });
        return ranges;
    }

    /**
     * Removes a range from the list
     * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
     */
    remove(range) {
        let left = [];
        this.ranges.forEach((irange, i) => {
            let start = range[0],
                end = range[1],
                curStart = irange[0],
                curEnd = irange[1];
            
            if (end > curStart && start <= curStart && end < curEnd && start < curEnd) {
                left.push([end, curEnd])
            } else if (start > curStart && end >= curEnd && end > curStart && start < curEnd) {
                left.push([curStart, start]);
            } else if (start > curStart && start < curEnd && end < curEnd && end > curStart) {
                left.push([curStart, start]);
                left.push([end, curEnd]);
            } else if (!(start <= curStart && end >= curEnd && start < curEnd && end > curStart)) {
                left.push([curStart, curEnd])
            }
        });

        this.ranges = left;
    }

    /**
     * Prints out the list of ranges in the range list
     */
    print() {
        let str = '';
        this.ranges.forEach(range => {
            str += `[${range[0]}, ${range[1]})`;
        });
        console.log(str);
    }
}


// Test Suite
// Helper Test function takes 3 arrays and outputs debug and test info
// Testing, fault tolerance/errors are implemented with simple console logs
function runTests() {
    /**
     * Test if adds and removes result in the expected output from our RangeList class
     * @param {*} adds array of ranges to call add on
     * @param {*} removes array of ranges to call remove on
     * @param {*} expect expected final output
     */
    function Test(adds, removes, expect) {
        const rl = new RangeList();

        adds.forEach(arr => rl.add(arr));
        removes.forEach(arr => rl.remove(arr));

        let testPass = true;
        let debug = ` adds: ${adds} | removes: ${removes} | expect: ${expect} | actual : ${rl.ranges}`;
        if (rl.ranges.length === expect.length) {
            rl.ranges.forEach((range, i) => {
                if (expect[i][0] !== range[0] ||
                    expect[i][1] !== range[1]) {
                        testPass = false;
                    }
            });
        } else {
            testPass = false;
        }

        if (!testPass) return console.log(`Test failed: ${debug}`);
    }

    // Tests
    // Same as example
    Test([[1, 5],[10, 20],[20, 20],[20, 21],[2, 4],[3, 8]],
        [[10, 10],[10, 11],[15, 17],[3, 19]],
        [[1,3],[19,21]]) 
    // Test add
    Test([[1,2]], [], [[1,2]])
    // Test overlaps on insert
    Test([[10, 11], [3, 4], [4, 10]],
        [],
        [[3,11]])
    // same io
    Test([[10, 20], [10, 20]],
        [[10, 20]],
        [])
    Test([[1,2], [3,4]],
        [], 
        [[1,2],[3,4]])
    Test([[1,2], [3,4]],
        [[1,2]],
        [[3,4]])

    Test([[1,2],[3,5]],
        [[4,5],[1,2]],
        [[3,4]]) // remove
    Test([[1,3],[3,7]],
        [[4,6]],
        [[1,4],[6,7]])  // split set
    Test([[1,2],[3,4],[8,11]],
        [[2,5]],
        [[1,2],[8,11]]) // delete set enveloped in remove range

    Test([[10,21]],
        [[1,11]],
        [[11,21]]) // test remove before w/ start overwrite
    Test([[10,21]],
        [[1,9]],
        [[10,21]]) // test remove before
    Test([[10,21]],
        [[21,25]],
        [[10,21]]) // test remove after
    Test([[10,21]],
        [[20,25]],
        [[10,20]]) // test remove after w/ end overwrite
    Test([], [1,2], [])
}

runTests();
  // Example run
const rl = new RangeList();

rl.add([1, 5]);
rl.print();
// Should display: [1, 5)

rl.add([10, 20]);
rl.print();
// Should display: [1, 5) [10, 20)

rl.add([20, 20]);
rl.print();
// Should display: [1, 5) [10, 20)

rl.add([20, 21]);
rl.print();
// Should display: [1, 5) [10, 21)

rl.add([2, 4]);
rl.print();
// Should display: [1, 5) [10, 21)

rl.add([3, 8]);
rl.print();
// Should display: [1, 8) [10, 21)

rl.remove([10, 10]);
rl.print();
// Should display: [1, 8) [10, 21)

rl.remove([10, 11]);
rl.print();
// Should display: [1, 8) [11, 21)

rl.remove([15, 17]);
rl.print();
// Should display: [1, 8) [11, 15) [17, 21)

rl.remove([3, 19]);
rl.print();
// Should display: [1, 3) [19, 21)

console.log("new")

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

const numpadMap = {
    2: ['a', 'b', 'c'],
    3: ['d', 'e', 'f'],
      // ...
  }
  
function numPadSelection(number) {
    let numArr = number.split('');
    let output = [];
    
    function _generate(numArr, i, resultSoFar) {
      let cur = numArr[i];
      if (numArr.length == resultSoFar.length) return output.push(resultSoFar);
      if (cur == 0 || cur == 1) {
        numArr = numArr.splice(i, 1);
        return _generate(numArr, i, resultSoFar);
      } else {
        i++;
        numpadMap[cur].forEach((letter) => {
          _generate(numArr, i, resultSoFar+letter);
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
 * Time complexity is n+m
 */



function main(word='', board=[]) {
function search(wordArr, char, i) {
    wordArr.forEach(charInArr => {
        if (charInArr == char) {
            
        }
    });
}
function goLeft() {

}
function goRight() {

}
}