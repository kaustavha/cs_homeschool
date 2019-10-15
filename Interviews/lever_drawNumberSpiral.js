/**
//  * drawSpiral(3,4)
//  * [[1, 2, 3, 4],
//  * [10, 11, 12, 5],
//  * [9, 8, 7, 6]]
 */


function drawSpiral(length, width) {
    function initMatrix(length, width) {
        let matrix = [];
        for (let i=0; i<length; i++) {
            matrix.push(new Array(width));
        }
        return matrix;
    }
    function moveInDirection(matrix, maxN) {
        let row = 0, col = 0, curN = 1;
        let dir = '';
        while (curN <= maxN) {
            let curRow = matrix[row];
            dir = getDirection(dir);

            if (dir == 'r') {
                let i = col;
                while (curN <= maxN && curRow[i] == undefined && i < curRow.length) {
                    curRow[i] = curN;
                    curN++;
                    i++;
                }
                col = i-1;
                row++;
            } else if (dir =='d') {
                let i = row;
                while (curN <= maxN && i < matrix.length && matrix[i][col] == undefined) {
                    matrix[i][col] = curN;
                    i++;
                    curN++;
                }
                row = i-1;
                col--;
            } else if (dir == 'l') {
                let i = col;
                while (i>=0 && curN <= maxN && curRow[i] == undefined) {
                    curRow[i] = curN;
                    curN++;
                    i--;
                }
                col = i+1;
                row--;
            } else if (dir == 'u') {
                let i = row;
                while (i>=0 && curN <= maxN && matrix[i][col] == undefined) {
                    matrix[i][col] = curN;
                    curN++;
                    i--;
                }
                col++;
                row = i+1;
            }
        }
        return matrix;
    }

    function getDirection(str) {
        if (str == 'r') return 'd';
        if (str =='d') return 'l';
        if (str =='l') return 'u';
        if (str == 'u') return 'r';
        return 'r';
    }

    return moveInDirection(
        initMatrix(length, width),
        length * width
    )
}

console.log(drawSpiral(0,0))
console.log(drawSpiral(0,1))
console.log(drawSpiral(1,0))

console.log(drawSpiral(3,3))
console.log(drawSpiral(3,2))
console.log(drawSpiral(2,8))
console.log(drawSpiral(8,8))

console.log(drawSpiral(3,4))
