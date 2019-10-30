var _ = require('underscore');


/* 
Your previous Plain Text content is preserved below:

Hello Kaustav.

hi

http://xkcd.com/287/

("Fruit", 2.15);
("Fries", 2.75);
("Salad", 3.35);
("Wings", 3.55);
("Mozzarella", 4.20);
("Plate", 5.80);

    * 7 * mixed fruit
    * mixed fruit + 2 * wings + sampler plate


 */

// no dp
// try tree

let mockItems = [
    {"Fruit": 2.15},
    {"Fries": 2.75},
    {"Salad": 3.35},
    {"Wings": 3.55},
    {"Mozzarella": 4.20},
    {"Plate": 5.80}
]
let mockAmt = 15.05

let treeRoot = {
    val: 0,
    sum: 0,
    set: [],
    name: null,
    children: []
};

let solutions = [];

function buildTree(items, treeRoot, amt){
    items.forEach(element => {
        let obj = {
            val: getVal(element),
            name: getKey(element),
            children: [],
            set: treeRoot.set.slice()
        }
        obj.sum = treeRoot.sum + obj.val;
        obj.set.push(element)
        if (obj.sum < amt) {
            treeRoot.children.push(obj)
            buildTree(items, obj, amt)
        } else if (obj.sum === amt) {
            solutions.push(obj.set)
        }
    });
}

function seenSolution(arr, obj) {
    let found = false;
    arr.forEach(ele => {
        if (compareKeys(obj, ele)) {
            found = true;
        }
    })
    return found;
}

function compareKeys(a, b) {
    var aKeys = Object.keys(a).sort();
    var bKeys = Object.keys(b).sort();
    return JSON.stringify(aKeys) === JSON.stringify(bKeys);
}

function getUniqueSolutions(arr, obj) {
    let solns = [];
    arr.forEach(ele => {
        if (solns.length == 0) {
            solns.push(ele)
        } else if (!seenSolution(solns, ele)) {
            solns.push(ele)
        }
    })
    return solns;
}

buildTree(mockItems, treeRoot, mockAmt)

function getKey(obj) {
    return Object.keys(obj)[0];
}

function getVal(obj) {
    return Object.values(obj)[0];
}

buildTree(mockItems, treeRoot, mockAmt)
// console.log(sum(mockItems))
// console.log(treeRoot)
// console.log(solutions)
console.log(getUniqueSolutions(solutions))

// Legacy attempt 1

// function findCombo(items, amt) {
  
//   let solutionSets = [];

//   function _findCombo(items, solutionSetSoFar, i, amt) {
    
//     if (sum(solutionSetSoFar) <= amt) {
//       console.log('1', solutionSetSoFar, i, amt)
//       let curItem = items[i];
//       if (getVal(curItem) + sum(solutionSetSoFar) < amt) {
        
//       console.log('2', solutionSetSoFar, i, amt)
//         let tempSum = sum(solutionSetSoFar);
//         while (tempSum < amt) {
          
//           solutionSetSoFar.push(curItem);
//           _findCombo(items, solutionSetSoFar, i++, amt);
//         }
//         _findCombo(items, solutionSetSoFar, i++, amt);
//       } else if (sum(solutionSetSoFar) == amt) {
//         solutionSets.push(solutionSetSoFar);
//         return -1;
//       } else {
//         _findCombo(items, solutionSetSoFar, i++, amt);
//         let tempSolnSet = solutionSetSoFar.pop();
//         if (solutionSetSoFar.length > 0) {
          
//       console.log('3', solutionSetSoFar, i, amt)
//           // _findCombo(items, tempSolnSet, i, amt);
//         }
//         return -1;
//       }
//     }
//   }
  
  
//   _findCombo(items, [], 0, amt);
//   return solutionSets
  
// }

// function sum(sets) {
  
//   let sum = 0;
// //   array.reduce(function(prev, cur) {
    
// //   })
//   for (let i in sets) {
//     let val = sets[i];
//     // console.log(Object.values(val)[0])
//     sum += getVal(val)
//   }
//   return sum;
// }
