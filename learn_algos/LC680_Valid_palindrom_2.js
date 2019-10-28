/**
 * @param {string} s
 * @return {boolean}
 */
var validPalindrome = function(s) {
    function compareStr(aChars, bChars) {
        let iter = bChars.length-1,
            isSame = true;
        aChars.some((char, i) => {
            if (char !== bChars[iter-i]) {
                isSame = false;
                return;
            }
        });
        return isSame;
    }

    function isPalindrome(s) {
        let isOdd = s.length % 2 > 0 ? true : false,
            mid,
            right, left;
        if (isOdd) {
            mid = (s.length-1)/2;
            left = s.slice(0, mid);
            right = s.slice(mid+1, s.length);
        } else {
            mid = s.length/2;
            left = s.slice(0, mid);
            right = s.slice(mid, s.length);
        }
        return compareStr(left, right)      
    }
    
    /**
    * Intuition - palindrome can be constructed if removal of any char generates palindrome
    * Conversly since a valid palindrome can have at most 1 non paired val
    * If we can't construct a valid palindrome via a single removal, one doesnt exist in this case
    * Algo:
    * 2 pointer approach => 2 pointers, 1 at start, one at end
    * move pointers toward each other while chars match and ptrs dont overlap 
    * i.e. check mirror property of palindromic strings
    * if at some point we find a invalid char:
    *   We check the two generated strings:
    *       - removing the char from the left ptr pos
    *       - removing the char from the right pts pos
    * If either of these result in a valid palindrome then one can be constructed
    * Otherwise not
    */
    function twoPointerApproach(s) {
        let left = 0,
            right = s.length-1,
            leftChar = s[left],
            rightChar = s[right],
            leftArr = [],
            rightArr = [];
        while (left < right && leftChar==rightChar) {
            left++;
            right--;
            leftChar = s[left];
            rightChar = s[right];
        }
        if (left < right) {
            return isPalindrome((s.slice(0, left).concat(s.slice(left+1, s.length)))) || 
                isPalindrome(s.slice(0, right).concat(s.slice(right+1, s.length)));
        }
        return true;
    }
    
    
    let strArr = s.split('');
    if (isPalindrome(strArr)) return true;
    return twoPointerApproach(strArr);
};
