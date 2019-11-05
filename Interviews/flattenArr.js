// Asked by both
// Theorem LLC
// Amount / Avant

// [[1,2,[3]],4] -> [1,2,3,4]

/**
 * Recursively flattens an array of arrays
 * @param {Array} arr Array of numbers or other arrays to flatten
 * @returns {Array<Number>} Flattened array
 */
function infiniFlatten(arr) {
    const flatten = (arr) => {
        let flattendArr = [];
        arr.forEach(element => {
            if (typeof element !== 'number') {
                let ret = flatten(element);
                flattendArr = flattendArr.concat(ret);
            } else {
                flattendArr.push(element);
            }
        });
        return flattendArr;
    }

    return flatten(arr)
}

function Test(input, expected) {
    let res = infiniFlatten(input);
    if (JSON.stringify(res) != JSON.stringify(expected)) {
        console.log(`Test fail: Actual ${res} Exp: ${expected} In: ${input}`)
    }
}

Test([[1, 2, [3]], 4], [1, 2, 3, 4])
Test([[[1, 1, 1]], 4], [1, 1, 1, 4])
Test([], [])
Test([[]], [])
Test([[]], [])
let res = infiniFlatten([[1, 2, [3]], 4])
console.log(res)
// Write a function that takes an array and returns a flattened
// version of the input array.
// Examples:
// flatten([ 1, 2, [ 3, [ 4, 5, [ 6, [ '7' ] ], 8 ], 9 ] ])
// [1, 2, 3, 4, 5, 6, 7, 8, 9]
// flatten([[[[1]]]])
// [1]

// Given a second, optional, parameter depth
// flatten(arr, depth: number | undefined)
// flatten([[[[1]]]]) // [ 1 ]
// flatten([[[[1]]]], 0) // [[[[1]]]]
// flatten([[[[1]]]], 1) // [[[ 1 ]]]
// flatten([[[[1]]]], 2) // [[ 1 ]]
// flatten([[[[1]]]], 3) // [ 1 ]

// strings or number {a: 'kj', length: 'test'} 

function flatten(arr, depth = -1) {

    const _flatten = (arr, level) => {
        if (level === depth) return arr;
        level++;

        let flattenedArr = [];
        arr.forEach(ele => {
            if (Array.isArray(ele)) {
                let ret = _flatten(ele, level);
                flattenedArr = flattenedArr.concat(ret)
            } else {
                flattenedArr.push(ele);
            }
        })
        return flattenedArr;
    }

    return _flatten(arr, 0);
}


let arr = [[[[{ a: 'kj', length: 'test' }]]]];
let res = flatten(arr, 2);
console.log(res)
