/**
 * 
 * 2 questions
 * 1 cell automate q - described conditions
 * 2 write  afunc for generalized gcd - find highest common factor on an array of numbers
 * Notes: their platform may complain and throw runtime errors at es6 constructs
 */

// IMPORT LIBRARY PACKAGES NEEDED BY YOUR PROGRAM
// SOME FUNCTIONALITY WITHIN A PACKAGE MAY BE RESTRICTED
// DEFINE ANY FUNCTION NEEDED
// FUNCTION SIGNATURE BEGINS, THIS FUNCTION IS REQUIRED
function cellCompete(origstates, days)
{
    // WRITE YOUR CODE HERE 
    var nextState = function(i, states) {
        var leftActive,
            rightActive,
            nextState;
        if (i == 0) {
            leftActive = false;
        } else {
            leftActive = states[i-1]==1;
        }
        if (i == (states.length - 1)) {
            rightActive = false;
        } else {
            rightActive = states[i+1]==1;
        }
        if ((!rightActive && !leftActive) || (rightActive && leftActive)) {
            nextState = 0;
        } else {
            nextState = 1;
        }
        return nextState;
    }
    
    var statesCopy = origstates;
    while (days>0) {
        var tempState = [];
        for (var i=0; i<origstates.length; i++) {
            tempState[i] = nextState(i, statesCopy);
        }
        statesCopy = tempState;
        days--;
    }
    
    return statesCopy;
}
// FUNCTION SIGNATURE ENDS

// IMPORT LIBRARY PACKAGES NEEDED BY YOUR PROGRAM
// SOME FUNCTIONALITY WITHIN A PACKAGE MAY BE RESTRICTED
// DEFINE ANY FUNCTION NEEDED
// FUNCTION SIGNATURE BEGINS, THIS FUNCTION IS REQUIRED
function generalizedGCD(num, arr)
{
    if (!num || !arr || arr.length==0 || num ==0) {
        return 0;
    }
    if (num == 1) {
        return arr[0];
    }
    // WRITE YOUR CODE HERE 
    function gcd(a, b) {
        while (b != 0) {
            var temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
    function onPair(a, b) {
        if (a == 0) {
            return b;
        } else if (b == 0) {
            return a;
        }
        a = Math.abs(a);
        b = Math.abs(b);
        var rem = a > b ? gcd(a,b) : gcd(b, a);
        return rem;
    }
    var res = arr[0];
    for (var i=1; i<=arr.length-1; i++) {
            res = onPair(arr[i], res);
    }
    return res;
    
}
// FUNCTION SIGNATURE ENDS