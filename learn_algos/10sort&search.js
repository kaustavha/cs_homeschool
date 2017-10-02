let util = require('./util.js');
let log = util.clog;

let randStr = util.genRandStr();
let randIntArr = util.genRandIntArr(10);
// mergesort

function mergesort(list) {
	function _mergesort(list) {
		// basecase/ return pt 1 item list is automatically sorted.
		if (list.length <= 1) return list;
		// log(list);/
		let mid = Math.floor(list.length/2),
			left = list.slice(0, mid),
			right = list.slice(mid, list.length);
			// log(left, right);/
		left = _mergesort(left);
		right = _mergesort(right);
		let sorted = _sort(left, right);
		return sorted;
	}

	function _sort(l, r) {
		let li = 0, ri = 0, sorted = [];
		while (li < l.length && ri < r.length) {
			if (l[li] < r[ri]) {
				sorted.push(l[li++]);
			} else if (r[ri] < l[li]) {
				sorted.push(r[ri++]);
			} else if (l[li] == r[ri]) {
				sorted.push(l[li++]);
				sorted.push(r[ri++]);
			}
		}
		// stick any left over elements into back of array
		if (li < l.length) {
			sorted = sorted.concat(l.slice(li, l.length));
		}
		if (ri < r.length) {
			sorted = sorted.concat(r.slice(ri, r.length));
		}
		return sorted;
	}
	return _mergesort(list);
}

log('Merge sort');
log(randIntArr);
var sorted = mergesort(randIntArr);
log(sorted);

function binarySearch(arr, x) {
	function _binarySearch(arr, x, low, high) {
		if (low > high) return -1;
		let mid = Math.floor((low+high)/2);
		if (arr[mid] < x) {
			return _binarySearch(arr, x, mid+1, high);
		} else if (arr[mid] > x) {
			return _binarySearch(arr, x, low, mid-1);
		} else {
			return mid;
		}
	}
	return _binarySearch(arr, x, 0, arr.length);
}

let x = randIntArr[1];
log(x);
log(binarySearch(sorted, x));

