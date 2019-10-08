/**
 * https://gist.githubusercontent.com/cmikec/9e926a20e5d04b942b03/raw/3df5101440a4c1dfcdd67cb4af5c7edddb227132/spiral.txt
 * Magic SE Oct '19
 * Q. Write code that draws a spiral of *
 * 
 * Soln: Useage: `node magic.js`
 * Given a max length (hardcoded as 599 based on given image)
 * Recurse either up/down/left/right until we hit max length
 *  - Add a * at each position [x][y] in the matrix
 *  - incr length before passing control
 * At the end we go through this generated matrix
 * Fix js issue with -ve number indices
 * Pad any missing values
 * Output the matrix
 */

function drawSpiral(maxLength) {
    // reqd for js hack
    // JS array w/ -ve indices doesnt work as expected
    // We'll use the max matrix dimensions later to correctly re-construct the arrays
    let dims = {
        maxx: 0, minx: 0,
        maxy: 0, miny: 0
    }
    function grabMaxDims(x, y) {
        dims.maxx = Math.max(parseInt(x), dims.maxx);
        dims.minx = Math.min(parseInt(x), dims.minx);
        dims.maxy = Math.max(parseInt(y), dims.maxy);
        dims.miny = Math.min(parseInt(y), dims.miny);
    }

    let soln = [[]];
    function down(x,y,length,totalLength) {
        let i=0;
        while (totalLength < maxLength && i<length) {
            i++;
            totalLength++;
            if (soln[y+i] == undefined) soln[y+i] = [];
            soln[y+i][x] = '*';
        }
        let newDim = y+i;
        grabMaxDims(x, newDim)
        if (totalLength < maxLength) {
            return right(x, newDim, length+1, totalLength);
        }
        return fill(soln);
    }
    function right(x=0, y=0, length=0, totalLength) {
        if (soln[y] == undefined) soln[y] = [];
        let i=0;
        while (totalLength < maxLength && i<length) {
            i++;
            totalLength++;
            soln[y][x+i] = '*';
        }
        let newDim = x+i;
        grabMaxDims(newDim, y);
        if (totalLength < maxLength) {
            return up(newDim, y, length+1, totalLength);
        }
        return fill(soln);
    }
    function up(x=0, y=0, length, totalLength) {
        let i=0;
        while (totalLength<maxLength && i<length) {
            i++;
            totalLength++;
            if (soln[y-i] == undefined) soln[y-i] = [];
            soln[y-i][x] = '*';
        }
        let newDim = y-i;
        grabMaxDims(x, newDim)
        if (totalLength < maxLength) {
            return left(x, newDim, length+1, totalLength);
        }
        return fill(soln);
    }
    function left(x,y,length,totalLength) {
        if (soln[y] == undefined) soln[y] = [];
        let i=0;
        while (totalLength < maxLength && i<length) {
            i++;
            totalLength++;
            soln[y][x-i] = '*';
        }
        let newDim = x-i;
        grabMaxDims(newDim, y);
        if (totalLength < maxLength) {
            return down(newDim, y, length+1, totalLength);
        }
        return fill(soln);
    }

    function fill(matrix) {
        // First pass - we fill any empty rows in our matrix with a literal empty array
        // And turn the array from having -ve keys to all +ve keys
        matrix = _objToArr(matrix, new Array(matrix[0].length), dims.maxy, dims.miny);
        for (let y in matrix) {
            let line = matrix[y];
            // 2nd pass - we overwrite any undefined with a space in the cells and also correctly sort our array
            matrix[y] = _objToArr(line, ' ', dims.maxx, dims.minx);
        }
        return matrix;
    }

    soln[0] = [];
    soln[0][0] = '*';

    return down(0,0,1,0);
}

/**
 *  Returns a normal iterable array from an array with -ve numbers, padding any missing elements with the provided filler
 * @param {Array} obj An array containing -ve numbers as indices, behaves like an object at times
 * @param {*} filler Filler material to populate missing members e.g. array or string
 * @param {Number} maxPos maximum positive value of a key in array
 * @param {Number} maxNeg max -ve value of a key in the incoming array
 * @returns {Array} Sorted array
 */
function _objToArr(obj, filler, maxPos, maxNeg) {
    // js arr with -ev nums are treated similiar to obj
    // -ve keys come after +ve numeric keys
    // +ve keys are stored in asc order 
    // -ve keys are stored in desc order
    // i.e. 0 1 2 -1 -2
    // we also need to manually iter keys since .forEach on arr ignores -ve keys

    // herein we create a left array for the -ve keys
    // right arr for +ve keys
    // fill and pad them to the max lengths then return concated result
    // using filler value for missing members
    let outArrLeft = new Array();
    let outArrRight = new Array(maxPos);
    for (let i=0; i<=maxPos; i++) {
        // fill right arr w/ +ve nums
        if (obj[i] == undefined && outArrRight[i] == undefined) {
            outArrRight[i] = filler;
        } else {
            outArrRight[i] = obj[i];
        }
    }
    for (let i=-1; i>=maxNeg; i--) {
        // fill left arr w/ -ve nums
        if (obj[i] == undefined && outArrLeft[i] == undefined) {
            outArrLeft.unshift(filler);
        } else {
            outArrLeft.unshift(obj[i]);
        }
    }
    return outArrLeft.concat(outArrRight);
}

// Raw Array output
let res = drawSpiral(599);

function printSpiral(matrix) {
    matrix.forEach(ele => console.log(`${ele.join(' ')}`))
}
printSpiral(res);
