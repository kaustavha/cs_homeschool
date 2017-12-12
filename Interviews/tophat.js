
// Q1: Palindrome

// discern if word is a palindrome
// technical answer that checks using letters
// will fail if actual word structure isnt palindrome
//(On+k) + 
function palindrome(str) {
	let map = {};
	for (let i=0; i < str.length; i++) {
		let char = str[i];
		if (map[char]) {
			map[char]++;
		} else {
			map[char] = 1;
		}
	}
	let count = 0;
	for (let key in map) {
		if (map[k] % 2 > 0) count++;
	}
	if (count > 1) return false; 
	return true;
}

// O(n), works better.
// Only detects real palindromes
// checks word structure
function palindromeStrict(str) {
	let left, right, mid;

	mid = Math.floor(str.length / 2);
	if (str.length % 2 > 0) {
		left = str.substring(0, mid);
		right = str.substring(mid+1, str.length);
	} else {
		left = str.substring(0, mid);
		right = str.substring(mid, str.length);
	}

	for (let i = 0; i< left.length; i++) {
		let charA = left[i],
			charB = right[right.length-i];
		if (charA != charB) return false;
	}
	return true;
}


// Q2: List intersecttion

// Given 2 lists or arrays of uniq vals find their intersect
// i.e. shared elements between the 2
function listIntersect(arr1, arr2) {
	let map = {}, out = [];
	for (let i = 0; i < arr1.length; i++) {
		map[arr1[i]] = false;
	}
	for (let i = 0; i < arr2.length; i++) {
		if (map[arr2[i]]) map[arr2[i]] = true;
	}
	for (let key in map) {
		if (map[key] == true) out.push(key);
	}
	return out;
}

function listIntersectWithDups(arr1, arr2) {
	let map1 = {}, map2 = {}, out = [];
	for (let i = 0; i < arr1.length; i++) {
		if (map1[arr1[i]]) {
			map1[arr1[i]] += 1;
		} else {
			map1[arr1[i]] = 1;
		}
	}
	for (let i = 0; i < arr2.length; i++) {
		if (map2[arr2[i]]){
			map2[arr2[i]] += 1
		} else {
			map2[arr2[i]] = 1;
		}
	}

	for (let key in map1) {
		if (map2[key]) {
			let count = Math.min(map1[key], map2[key]);
			for (let i=0; i < count; i++) {
				out.push(key);
			}
		}
	}
	return out;
}


// Q3: Implement fibonacci generator
// implement iterative 0n soln.

// Memoized fib gen
// Faster if used more 
// Space: O(N)
// Without memo time complexity: O(2^N)
// With memo: O(1) best case, O(2^N) worst case
var memo = {};

function fib(n) {
	if (n==0) return 0;
	if (n== 1) return 1;
	if (memo[n]) {
		return memo[n];
	} else {
		memo[n] = fib(n-1) + fib(n-2);
	}
	return memo[n];
}

// iterative fibgen starting from 0 instead of n like recursive solns
// Best case and worst case TC: O(N), space complexity is O(1)
function iterFib(n) {
	let a = 0,
		b = 1;
	for (let i = 0; i < n; i++) {
		[a, b] = [b, a+b]
	}
	return a;
}

// Q4: Fields,
// Given a matrix of bool values, T and F
// Any contigous domain of Trues is a field
// Contigous in this case -> other field members need to share a border
// so no diagonal pieces only to the left, right, up, down


// Soln1: Recursively check to the left, right, up, down of every field triggered when we land on a true cell
// thus building a unique set of field coords, insert into a list of fields
// if new field comes in with shared elements we ignore it due to building a set of sets of field coords
// at the end count all fields we have in our fields list/set
function fields(matrix) {
	let fields = [];
	for (var i = 0; i < matrix.length; i++) {
		for (let j = 0; j < matrix[i].length; j++) {
			if (matrix[i][j]) uniqueMerge(getFieldSet(matrix, i, j), fields);
		}
	}
	return fields;
}


function uniqueMerge(arr) {
	if (arr.length < 2) return arr;
	let out = [], startArr = arr[0], nextArr = arr[1], mergedArr;
	mergedArr = _uniqueMerge(startArr, nextArr);
	arr.shift();
	arr[0] = mergedArr;
	uniqueMerge(arr);
}

// merge and dedupe 2 arrs
function _uniqueMerge(arr1, arr2) {
	let set = [];

	for (var i = 0; i < arr1.length; i++) {
		let obj1 = arr1[i];
		let obj2 = arr2[i];

		if (obj1.row == obj2.row && obj1.col == obj2.col) {
			set.push(obj1);
		} else {
			set.push(obj1);
			set.push(obj2);
		}
	}
}

function getFieldSet(matrix, startRow, startCol, carriedSet) {
	let set = [];
	if (!matrix[startRow][startCol]) return [];
	set.push({'row': startRow, 'col': startCol});

	let left = getLeftMost(matrix, startRow, startCol-1), carriedSet,
		right = getRightMost(matrix, startRow, startCol+1, carriedSet),
		top = getTopMost(matrix, startRow-1, startCol, carriedSet),
		bottom = getBottomMost(matrix, startRow+1, startCol, carriedSet);

	set = uniqueMerge([set, left, right, top, bottom]);
	return set;
}

function getLeftMost(matrix, startRow, startCol, carriedSet) {
	let m = matrix[startRow][startCol];
	if (carriedSet.contains({'row': startRow, 'col': startCol})) return carriedSet;
	let outSet = [];
	if (m != true) return carriedSet;
	if (m == true && startCol > -1) {
		outSet.push({'row': startRow, 'col': curCol});
	}
	return getFieldSet(matrix, startRow, startCol, outSet);
}

function getRightMost(matrix, startRow, startCol, carriedSet) {
	let m = matrix[startRow][startCol];
	if (carriedSet.contains({'row': startRow, 'col': startCol})) return carriedSet;
	let outSet = [];
	if (m != true) return carriedSet;
	if (m == true && startCol < matrix[startCol].length) {
		outSet.push({'row': startRow, 'col': curCol});
	}
	return getFieldSet(matrix, startRow, startCol, outSet);
}

function getTopMost() {
	let m = matrix[startRow][startCol];
	if (carriedSet.contains({'row': startRow, 'col': startCol})) return carriedSet;
	let outSet = [];
	if (m != true) return carriedSet;
	if (m == true && startRow > -1) {
		outSet.push({'row': startRow, 'col': curCol});
	}
	return getFieldSet(matrix, startRow, startCol, outSet);

}
function getBottomMost() {
	let m = matrix[startRow][startCol];
	if (carriedSet.contains({'row': startRow, 'col': startCol})) return carriedSet;
	let outSet = [];
	if (m != true) return carriedSet;
	if (m == true && startRow < matrix.length) {
		outSet.push({'row': startRow, 'col': curCol});
	}
	return getFieldSet(matrix, startRow, startCol, outSet);
}


// Soln 2: Iteratively walk through the field, for every cell thats true
//             Try to find if its adjacent to any recorded cells in our set of sets of field cells
//              If it is, insert it into that field
//              Else make a new field with that cell and push it to our fields list/set
function fields(matrix) {
	let fields = [], row, col;
	for (var i = 0; i < matrix.length; i++) {
		row = matrix[i];
		for (var j = 0; j < row.length; j++) {
			col = row[j];
			let cell = {row: row, col: col};
			if (matrix[i][j] == true) fields = insertIntoFields(cell, fields);
		}
	}
	return fields.length;
}

// fix so that if it finds a coord with isAdjacent true to cells
// in >1 field it merges those fields
function insertIntoFields(cell, fieldsArr) {
	let inserted = false;

	for (var i = 0; i < fieldsArr.length; i++) {
		let curFieldSet = fieldsArr[i];
		for (var j = 0; j < curFieldSet.length; j++) {
			let fieldCell = curFieldSet[j];
			if (isAdjacent(cell, fieldCell)) {
				inserted = true;
				curFieldSet.push(cell);
				fieldsArr[i] = curFieldSet;
			}
		}
	}
	if (!inserted) fieldsArr.push([cell]);
	return fieldsArr;
}

function isAdjacent(cell, testCell) {
	let row = cell.row, col = cell.col,
		testRow = testCell.row, testCol = testCell.col;
	let matchRow = false, matchCol = false;
	if (testRow == row+1 || testRow == row-1) {
		matchRow = true;
	}
	if (testCol == col+1 || testCell==col-1) {
		matchCol = true;
	}
	return (matchCol || matchRow) && !(matchCol && matchRow);
}


// 2
// 1+ 0

// 3
// 

// 3
// 2 = 1, 1 = 1
// 2



//1

console(listIntersectWithDups([1, 4, 2, 6, 10, 4],  [7, 4, 9, 10, 20]
));

console(listIntersectWithDups([1, 4, 2, 6, 10, 4, 4]
,  [7, 4, 9, 10, 20, 4, 10]));

// {1 = 1, 4 = 3, 10=1]}
// {4 = 2, 10=2}

console.log(palindrome("ABBA"))

console.log(palindrome("deleveled"))

console.log(palindrome("ABAB"))