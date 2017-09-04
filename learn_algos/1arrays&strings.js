
// utility funcs
function genRandCharArr() {
    let randCharArr = [];
    for (var i = 0; i < 10; i++) {
        let rand = Math.floor(Math.random() * 26);
        var char = String.fromCharCode(97 + rand);
        randCharArr.push(char);
    }
    return randCharArr;
}

function genRandStr() {
    return genRandCharArr().join('');
}

function clog(...str) {
    console.log(...str);
}

let randStr = genRandStr();
// console.log(randCharArr);
console.log(randStr);

//===================end util=============================

// 1.1 Isuniq: is every char in str uniq

function isUniqHT(str) {
    let table = {}, out = true;

    for (var i = 0; i < str.length; i++) {
        if (table[str[i]] !== undefined) {
            out = false;
        }
        table[str[i]] = 1;
    }
    return out;
}

// figure out how to use bitvector
function isUniq(str) {
    let checker = 0, // This is basically a 32 bit array 
    // of bits i.e. 00000000 00000000 00000000 00000000 minus the spaces
        out = true; 
    // now we loop through the string, checking against 
    // the checker and setting a bit at the ith position 
    // in it corresponding to the char, e.g. a = 1, z = 26
    for (var i = 0; i < str.length; i++) {
        // 1 in bits is a rightmost 1, i.e. 
        // 00000000 00000000 00000000 00000001
        // Chars start at 97 (i.e. a = 97) so we subtract 96 from the charcode
        // Then we get a number betw 1-26 and move that
        // leftmost 1 rightwards that much
        let bitRepr = (1<<(str.charCodeAt(i) - 96));
        // now we check against the checker, if theres
        // a 1 in the ith position then we've seen that char before
        // AND returns 0 unless its comparing 2 1's,
        // so we get back the bit repr of 1
        if ((bitRepr & checker) > 1) {
            out = false;
        } else {
        // if we dont see a 1 then we use or to stick a 1 into
        // the checker bitvector
        // OR returns 1 unless both numbers are 0s
        // i.e 00000001 & 00000101 = 00000101
            checker |= bitRepr;
        }
    }
    return out;
}

clog('\n 1.1 IsUnique: Is every letter in string unique \n');
clog(isUniqHT(randStr));
clog(isUniq(randStr));

// 1.2 CheckPerm: Given two strs check if 1 is permutation of other
function checkPerm(str1, str2) {
    let o = false, ht = {}; // strings are uniq
    if (str1.length == str2.length) {
        o = true;
        for (var i = 0; i < str1.length; i++) {
            if (ht[str1[i]] == undefined) ht[str1[i]] = 1;
        }
        for (var i = 0; i < str2.length; i++) {
            if (ht[str2[i]] == undefined) o = false;
        }
    }
    return o;
}

clog('\n 1.2. checkPermRes: Are 2 strings permutations of each other \n');
clog(checkPerm('hello', 'olJeh'));
clog(checkPerm(randStr, 'a'));
clog(checkPerm(randStr, randStr));
clog(checkPerm('hello', 'lloeh'));

// 1.3 URLify
function urlify(str) {
    return str.trim().split(' ').join('%20');
}

clog('\n 1.3 URLify \n');
clog(urlify('Mr john smith   '));

// 1.4 Palindrom perm?
function palinPerm(str) {
    // Palindrome can have at most 1 uniq char
    let store = {}, countOdd = 0;
    for (var i = 0; i < str.length; i++) {
        if (store[str[i]] == undefined || store[str[i]] == 2) {
            countOdd++;
            store[str[i]] = 1;
        } else {
            countOdd--;
            store[str[i]] = 2
        }
    }
    if (countOdd > 1) return false;
    return true;
}

clog('\n 1.4 Palindrome permutations \n');
clog(palinPerm('tacocat'));
clog(palinPerm('obbo'));
clog(palinPerm('bobobob'));
clog(palinPerm('bobobo'));

// 1.5 one away: check if 2 strings are 0-1 edits away
function oneAway(str1, str2) {
    let store = {}, uniqs = 0;
    for (var i = 0; i < str1.length; i++) {
        store[str1[i]] = store[str1[i]] == undefined ? 1 : store[str1[i]]+1;
    }
    for (var i = 0; i < str2.length; i++) {
        if (store[str2[i]] == undefined || store[str2[i]] == 0) {
            uniqs++;
        } else {
            store[str2[i]]--;
        }
        // store[str2[i]] = store[str2[i]] == undefined ? 1 : store[str1[i]]-1;
    }
    // console.log(uniqs);
    if (uniqs <= 1) return true;
    return false;
}

clog('\n 1.5 One Away \n');
clog(oneAway('pale', 'ple'));
clog(oneAway('pales', 'pale'));
clog(oneAway('bale', 'pale'));
clog(oneAway('pale', 'bake'));


// 1.6 String compression

function strCompress(str) {
    var thisChar = '', count=0, buffer='';
    for (var i = 0; i < str.length; i++) {
        if (thisChar == '') {
            thisChar = str[i];
            count++;
        } else if (thisChar == str[i]) {
            count++;
        } else if (thisChar !=  str[i]) {
            buffer += thisChar + count;
            thisChar = str[i];
            count = 1;
        }
    }
    buffer += thisChar + count;
    return (buffer.length > str.length) ? str : buffer;
}

clog('\n 1.6 String compress \n');
clog(strCompress('aabcccccaaa'))
clog(strCompress('abc'))
clog(strCompress(randStr))


// 1.7. rotate matrix


