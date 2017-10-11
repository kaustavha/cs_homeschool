/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function(nums) {
    
    let store ={}, a=false,b=false,c=false, results=[], resSeenCache={};
    function isZero(a,b,c) {return a+b+c == 0}
    function seenInRes(a,b,c) {
        let cacheName = [a,b,c].sort();
        if (resSeenCache[cacheName]) {
            return true;
        } else {
            resSeenCache[cacheName] = true;
            return false;
        }
    }
    
    let seenNums = {}, firstRun = true;
    
    
    for (var i=0; i<nums.length;i++){
        a = nums[i];
        if (!seenNums[a]) seenNums[a] = 1;
        for (let j=i+1; j<nums.length;j++) {
            b = nums[j];
            // build seensNums cache on first run
            if (firstRun) {
                if (seenNums[b]) {
                    seenNums[b] += 1;
                } else {
                    seenNums[b] = 1;
                }
            }
            
            let req = 0-(a+b);
            
            if (seenNums[req]) {
                // make sure n has been seen enuf times before to satisfy case
                let seens = seenNums[req];
                if (a==req) seens--;
                if (b==req) seens--;
                if (seens > 0) {
                    if (!seenInRes(a,b,req)) {
                        results.push([a,b,req]);
                    }
                }
            }
        }
        firstRun = false;
    }
    return results;
};