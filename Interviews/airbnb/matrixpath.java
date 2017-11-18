// given an m*n matrix a of 1s & 0s, count how many valid paths exist
// from top left (0,0) to bottom right (m,n)
// if matrix ele is 1 we can walkthere, if 0 we cant traverse
// must be fast, since solution w/ O(nlogn) fails

/*
e.g.
in:

3
4
1 1 1 1
1 1 1 1
1 1 1 1


2
2
1 1
0 1
=========
out:

10

1
*/


// slow, only timesout 7-10
static int foundPaths = 0;
static Set visitedPaths = new HashSet();
static int numberOfPaths(int[][] a) {
    _traverse(a, 0,0,new LinkedHashSet());
    return foundPaths;
}

static void _traverse(int[][] a, int x, int y, Set pathSoFar) {
    if (a[y][x] == 0) return;
    List loc = new ArrayList();
    loc.add(x);
    loc.add(y);
        //Set currentPos = new Set();
    //    currentPos.add(x);
//        currentPos.add(y);
        pathSoFar.add(loc);
    
    if (x == a[0].length-1 && y == a.length-1) {
        //if (!visitedPaths.contains(pathSoFar)) {
            foundPaths++;
            visitedPaths.add(pathSoFar);
    //    }
    }
    
    if (x < a[0].length-1) {
        _traverse(a, x+1, y, pathSoFar);
    }
    if (y<a.length-1) {
        _traverse(a, x, y+1, pathSoFar);
    }
}

// fails tc 3 and timesout @ 7-10

static int numberOfPaths(int[][] a) {
    return recurse(a, 0, 0);
}

static int recurse(int[][]a, int x, int y) {
    if (a[y][x] == 0) {
        return 1;
    }
    return recurse(a, x+1, y) + recurse(a, x, y+1);
}

// geeks for geeks, modified
// fast but wrong, fails 3,5, 6-10

static int numberOfPaths(int[][] a) {
    int m = a.length;
    int n = a[0].length;
    int count[][] = new int[m][n];
    for (int i = 0; i< m; i++)
        if (a[i][0] != 0)
            count[i][0] = 1;

    for (int j = 0; j<n;j++ )
        if (a[0][j] != 0)
            count[0][j] = 1;

    for (int i =1;i<m;i++) {
        for (int j =1; j<n; j++) {
            
            count[i][j] = count[i-1][j] + count[i][j-1];
            if (a[i][j] == 0) count[i][j] = 0;
        }
    }
    return count[m-1][n-1]%1000000007;

}