/**
91. Decode Ways
A message containing letters from A-Z is being encoded to numbers using the following mapping:

'A' -> 1
'B' -> 2
...
'Z' -> 26
Given a non-empty string containing only digits, determine the total number of ways to decode it.

Example 1:

Input: "12"
Output: 2
Explanation: It could be decoded as "AB" (1 2) or "L" (12).
Example 2:

Input: "226"
Output: 3
Explanation: It could be decoded as "BZ" (2 26), "VF" (22 6), or "BBF" (2 2 6).
**/

/**
Runtime: 8352 ms, faster than 5.02% of JavaScript online submissions for Decode Ways.
Memory Usage: 49.9 MB, less than 14.29% of JavaScript online submissions for Decode Ways.
**/

/**
 * @param {string} s
 * @return {number}
 */
var numDecodings = function(s) {
    let solns = 0;
    if (s <= 0) return 0;
    let dfs = (sRem, ptrStart) => {
        sRem = sRem.slice(ptrStart, sRem.length);
        if (sRem.length === 0) {
            solns++;
            return;
        }
        let oneDig = sRem[0];
        if (oneDig > 0) {
            dfs(sRem, 1);
        }
        let twoDig = sRem.slice(0,2);
        if (twoDig < 27 && twoDig > 9) {
            dfs(sRem, 2);
        }
        return;
    }
    
    dfs(s, []);
    return solns;
};

/**
Runtime: 6244 ms, faster than 7.15% of JavaScript online submissions for Decode Ways.
Memory Usage: 37.5 MB, less than 14.29% of JavaScript online submissions for Decode Ways.
**/
/**
 * @param {string} s
 * @return {number}
 */
var numDecodings = function(s) {
    let solns = 0, len = s.length;
    if (s <= 0) return 0;
    let dfs = (i) => {
        if (i >= len) {
            solns++;
            return;
        }
        let oneDig = s[i];
        if (oneDig > 0) {
            let nxtPtr = i+1;
            dfs(i+1);
        }
        let twoDig = s.slice(i,i+2);
        if (twoDig < 27 && twoDig > 9) {
            let nxtPtr = i+2;
            dfs(i+2);
        }
        return;
    }
    
    dfs(0);
    return solns;
};

