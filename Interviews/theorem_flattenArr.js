// usage: node theorem.js
// expected result is  [1,2,3,4] 
// input is currently hardcoded
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

// In the interest of simplicity tests are coded here
function Test(input, expected) {
    let res = infiniFlatten(input);
    if (JSON.stringify(res) != JSON.stringify(expected)) {
        console.log(`Test fail: Actual ${res} Exp: ${expected} In: ${input}`)
    }
}

Test([[1,2,[3]],4], [ 1, 2, 3, 4 ])
Test([[[1,1,1]],4], [ 1, 1, 1, 4 ])
Test([], [])
Test([[]], [])
Test([[]], [])

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

// In the interest of simplicity unit tests are here
function Test(input, expected) {
    let res = infiniFlatten(input);
    if (JSON.stringify(res) != JSON.stringify(expected)) {
        console.log(`Test fail: Actual ${res} Exp: ${expected} In: ${input}`)
    }
}

Test([[1,2,[3]],4], [ 1, 2, 3, 4 ])
Test([[[1,1,1]],4], [ 1, 1, 1, 4 ])
Test([], [])
Test([[]], [])
Test([[]], [])

let res = infiniFlatten([[1,2,[3]],4])
console.log(res)