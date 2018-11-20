/*
Given an array of integers, return indices of the two numbers such that they add up to a specific target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example:
```
Given nums = [2, 7, 11, 15], target = 9,

Because nums[0] + nums[1] = 2 + 7 = 9,
return [0, 1].
```
*/

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */

function twoSum (nums, target) {
	let targetMap = {}, locMap = {}, o;
	nums.forEach((x,i) => {
		if (targetMap[x] !== undefined) o = [i, locMap[targetMap[x]]]
		let diff = target - x
		targetMap[diff] = x
		locMap[x] = i
	});
	return o
}

function _test(nums, target, expect) {
	let out = twoSum(nums, target)
	if (out.indexOf(expect[0]) !== -1 &&
		out.indexOf(expect[1]) !== -1) {
		console.log("PASS");
	} else {
		console.log("FAIL", "GOT: ", out, "EXP: ", expect)
	}

}

function Test() {
	_test([3,2,4], 6, [2,1])
	_test([3,3], 6, [0,1])
	_test([0,4,3,0], 0, [0,3])
}

Test()