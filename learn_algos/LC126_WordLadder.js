/**
 * @param {string} beginWord
 * @param {string} endWord
 * @param {string[]} wordList
 * @return {string[][]}
 */
var findLadders = function(beginWord, endWord, wordList) {
    // dfs, create paths



};


// Installed npm packages: jquery underscore request express
// jade shelljs passport http sys lodash async mocha chai sinon
// sinon-chai moment connect validator restify ejs ws co when
// helmet wrench brain mustache should backbone forever debug jsdom

var _ = require('underscore');


  // Implement a basic calculator to evaluate a simple expression string.
  // The expression string contains only non-negative integers, +, -, *, / operators and empty spaces.
  // The integer division should truncate toward zero.
  // Note: You cannot use regex.
  // Example 1:
  // Input: "3+2*2"
  // Output: 7
  //
  // Example 2:
  // Input: " 3/2 "
  // Output: 1
  // Example 3:
  // Input: "  3 + 5 / 2 "
  // Output: 5
  
  // D M A S 

function calculator(inStr) {
  // multi length digits
  if (!inStr || inStr.length===0) return 0;
    let parsedStrArr = inStr.trim().split('').filter(char => char !== ' ');
    
    console.log(parsedStrArr);
    
    let fixedParsedStrArr = [];
    
    let numStr = '';
  for (let i = 0; i < parsedStrArr.length; i++) {
    let char = parsedStrArr[i];
    if (!isNaN(parseInt(char))) {
      numStr += char;
    } else {
      fixedParsedStrArr.push(numStr);
      numStr = '';
      fixedParsedStrArr.push(char);
    }
  }
  fixedParsedStrArr.push(numStr);
  
  console.log(fixedParsedStrArr)
    
    let dividedRes = [];

  for (let i = 0; i < fixedParsedStrArr.length; i++) {
    let char = fixedParsedStrArr[i];
    if (char === '/') {
      let a = dividedRes.pop(),
        b = fixedParsedStrArr[i + 1];
        
        a = parseInt(a);
        b = parseInt(b);
      dividedRes.push(Math.floor(a / b));
      i += 1;
    } else {
      dividedRes.push(char);
    }
  }
  console.log(dividedRes)
    
    let multipliedRes = [];
    
  for (let i=0; i<dividedRes.length; i++) {
    let char = dividedRes[i];
    if (char === '*') {
      let a = multipliedRes.pop(),
        b = dividedRes[i + 1];
      a = parseInt(a);
      b = parseInt(b);
      multipliedRes.push(Math.floor(a*b));
        i += 1;
      } else {
      multipliedRes.push(char);
      }
    }
    

  console.log(multipliedRes)

  let addedRes = [];

  for (let i =0; i<multipliedRes.length; i++) {
    let char = multipliedRes[i];
    if (char === '+') {
      let a = addedRes.pop(),
        b = multipliedRes[i+1];
      a = parseInt(a);
      b = parseInt(b);
      addedRes.push(Math.floor(a + b));
      i += 1;
    } else {
      addedRes.push(char);
    }
  }

  console.log(addedRes)
  let subtractedRes = [];

  for (let i =0; i < addedRes.length; i++) {
    let char = addedRes[i];
    if (char === '-') {
      let a = subtractedRes.pop(),
        b = multipliedRes[i + 1];
      a = parseInt(a);
      b = parseInt(b);
      subtractedRes.push(Math.floor(a - b));
      i += 1;
    } else {
      subtractedRes.push(char);
    }
  }
  
  // console.log(subtractedRes)
    

  // for (let i = 0; i < parsedStrArr.length; i++) {
  //   let char = parsedStrArr[i];
  //   if (char === '*') {
  //     let a = res.pop(),
  //       b = parsedStrArr[i + 1];
  //     res.push(Math.floor(a * b));
  //     i += 1;
  //   } else {
  //     res.push(char);
  //   }
  // }
    
    
    
  // parsedStrArr.forEach((char, i) => { 
  //   if (char === '*') {
  //     let a = res.shift(),
  //         b = parsedStrArr[]
  //   } else {
  //     res.push(char);
  //   }
  // })
  // parsedStrArr.forEach((char, i) => { })
  return subtractedRes[0];
}

//console.log(calculator("3+2*2")); // 7
//console.log(calculator(" 3/2 ")); // 1
//console.log(calculator("  3 + 5 / 2 ")); // 5

//console.log(calculator("  3 + 5 * 2 ")); // 13
console.log(calculator("  3 + 10 * 2 ")); // 23
console.log(calculator(""));

