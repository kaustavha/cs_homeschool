process.stdin.resume();
process.stdin.setEncoding('ascii');

var input_stdin = "";
var input_stdin_array = "";
var input_currentline = 0;

process.stdin.on('data', function (data) {
    input_stdin += data;
});

process.stdin.on('end', function () {
    input_stdin_array = input_stdin.split("\n");
    main();    
});

// function readLine() {
//     return input_stdin_array[input_currentline++];
// }

// function addNumbers(a, b) {
//   return a+b  
// }

// NEED TO FIX, CURRENTLY FAILS AT 1 ITER 
/**
 * co -> floor plan
 * single air con duct to get air con to most rooms
 * some rooms cant have aircon 
 * all marked on map
 * bldg has existing structures for 
 * start and end specified
 * need to do in semi-eff - no double checking rooms
 * given floor plan as input
 * total no. of diff ways we can route the aircon 
 */

/**
 * 0 = default room 
 * 1 = has aircon
 * -1 = no aircon allowed 
 * start, end => coords
 * [
 *   0, 0, 
 *   0, 0,
 * ]
 * start, end => [0,0], [1,0]
 * 
 * intuit - dfs
 * 
 * S 0 0 0 
 * 0 0 0 0
 * 0 0 E -1
 */

function airconify(grid, start, end) {
    visited = [];
    ways = 0;
    let dirs = [[1,0], [0,1], [-1,0], [0,-1]];
    // console.log(grid,start,end)

    function canTraverse(x,y,visited) {
        let point = grid[x][y];

        let res = (
            point !== -1 &&
            !visited[x][y] &&
            !(end[0] == x && end[1] == y) &&
            // start[0] !== x && start[1] !== y && // may not be needed
            x >= 0 && x <= grid.length &&
            y >= 0 && y <= grid[0].length
        );
        console.log(end[0] == x && end[1] == y)
        console.log(x,y,point,visited,res, start, end)

    }
    function successfulWalk(visited) {
        let success = true;
        grid.forEach((row, x) => {
            row.forEach((col, y) => {
                if (grid[x][y] == 0) {
                    if (!visited[x][y]) {
                        success = false;
                    }
                }
            })
        })
        return success;
    }
    function dfs(x, y, visited) {
        if (!canTraverse(x,y,visited)) return;
        visited[x][y] = true;
        let dirs = [[1,0], [0,1], [-1,0], [0,-1]];
        dirs.forEach(pair => {
            newx = x+pair[0];
            newy = y+pair[1];
            oldvisited = visited;
            dfs(newx, newy, visited);
            console.log('a',visited, newx, newy);
            if (canTraverse(newx, newy, oldvisited)) {
                if (successfulWalk(visited)) ways++;
            }
        });
    }
    function createVisitedGrid() {
        let visited = [];
        grid.forEach((row, x) => {
            visited[x] = [];
            row.forEach((col, y) => {
                visited[x][y] = false;
            })
        })
        return visited;
    }
    

    visited = createVisitedGrid();
    // dirs.forEach(dir => {
    //     let startNew = [start[0]+dir[0], start[1]+dir[1]];
    //     let visited = createVisitedGrid();
    //     dfs(startNew[0],startNew[1],visited);

    // })
    dfs(start[0],start[1],visited);
    return ways; 
    // if (successfulWalk(visited)) ways++;
    // grid.forEach((row, x) => {
    //     row.forEach((col, y) => {
    //         if (canTraverse(x,y,visited)) {
    //             dfs(x,y,visited);
    //             if (successfulWalk(visited)) ways++;
    //         }
    //     })
    // })
}



function main() {
    // var a = parseInt(readLine());
    // var b = parseInt(readLine());;

    // var res = addNumbers(a, b);
    // console.log("The sum is " + res);
    
    grid = [[0,0],[0,0]]
    start = [0,0]
    end = [1,0]
    console.log(grid, start, end)
    let ways = airconify(grid, start, end);
    console.log(ways);
}

