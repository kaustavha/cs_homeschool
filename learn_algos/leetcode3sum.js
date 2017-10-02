/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function(nums) {
    
    let store ={}, a=false,b=false,c=false, results=[], resSeenCache={};
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
            
            c = 0-(a+b);
            
            if (seenNums[c] && !seenInRes(a,b,c)) {
                // make sure n has been seen enuf times before to satisfy case
                let seens = seenNums[c];
                if (a==c) seens--;
                if (b==c) seens--;
                if (seens > 0) {
                    results.push([a,b,c]);   
                }
            }
        }
        firstRun = false;
    }
    return results;
};