/**
Given an m x n 2d grid map of '1's (land) and '0's (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.

 

Example 1:

Input: grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
Output: 1
Example 2:

Input: grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
Output: 3

**/
/**
 * @param {character[][]} grid
 * @return {number}
 */
var numIslands = function(grid) {
    islands = 0;
    visited = [];
    rows = grid.length;
    cols = grid[0].length;
    directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    
    function canTraverse(x,y,visited) {
        return (x < rows && x >= 0 &&
                y < cols && y >= 0 &&
                !visited[x][y] &&
                grid[x][y] == "1");
    }

    function dfs(x,y, visited) {
        if (!canTraverse(x,y,visited)) {
            return;
        }
        visited[x][y] = true;
        directions.forEach(pair => {
            dfs(x+pair[0], y+pair[1], visited);
        });
    }
    
    // Create visited set of all false
    grid.forEach((row, x) => {
        visited[x] = [];
        row.forEach((col, y) => {
            visited[x][y] = false;
        });
    });
    
    grid.forEach((row, x) => {
        row.forEach((col, y) => {
            if (visited[x][y] == false && col == "1") {
                dfs(x,y,visited);
                islands++;
            }
        });
    });
    
    return islands;
};
