
console.log('test')
// Find min number of jumps to exit, possible jumps = number at starting index then every index you land at
function findInterim(curi, n) {
  return curi+n;
}

function findJumps(arr) {
  let interimArr = [];
  let resArr = [];
  for (let i=0;i<arr.length; i++) {
    interimArr.push(findInterim(arr[i], i));
  }
  console.log(interimArr);
  
  let i=0;
  
//   for (let i=0; i< arr.length; i++) {
  while (i < arr.length) {
    let runLength = arr[i];
    
    if (runLength >= arr.length - i) {
      resArr.push(runLength);
      
      if (i !== arr.length-1) resArr.push(arr[arr.length-1]);
      break;
    }
    
    let maxnum = 0, nexti = 0;
    for (let j=i+1; j<=i+runLength; j++) {
      let tmp = interimArr[j];
      if (tmp > maxnum) {
        maxnum = tmp;
        nexti = j;
      }
      
    }
    resArr.push(runLength);
    i = nexti;
  }
  console.log(resArr);
  return resArr.length-1;
}

console.log(findJumps([1, 3, 5, 8, 9, 2, 6, 7, 6, 8, 9]));




// Given a binary array and an integer m where m is the maximum number 
// of flips that can be made, find the position of zeroes flipping which 
// creates maximum number of consecutive 1’s in array.

// Input: arr[] = {1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1}, m = 2
// Output: 5 7


// map = {
//  1: [1,1,]
//  2
// }

// 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1

// [ind, ind2]
// {
//   [ind, ind2]: 5
//   [ind1+1, ind3]: 5,
//   [ind2+1, ind4]: 7
  
// }
// 1, 0, 0, 1, 1, 1, 1, 1, 1, 1


// 125 
// 2 


function stackFind(arr, m) {
	let i = 0, stack = [], map = {}, indices=[], flipcount =0, soln = 0,
		seeni = 0;
	
	while (i < arr.length) {
	  let ele = arr[i];
	  if (ele === 1) {
		if (!map[soln]) map[soln] = [];
		if (seeni !== i) map[soln].push(1);
		i++;
	  } else if (flipcount === m && ele === 0) {
		soln++;
		map[soln] = []
		flipcount -= 1;
		map[soln].push(1);
		stack.push(i);
		
		arr[seeni] = 0;
		seeni = i;
		arr[seeni] = 1;
		
		i = stack.shift()+1;
	  } else {
		flipcount += 1;
		stack.push(i);
		map[soln].push(1);
		i++;
	  }
	  
	}
	
	let maxl = 0;
	
	for (let i in map) {
	  if (map[i].length > maxl) maxl = map[i].length;
	}
	return maxl;
  }
  
  console.log(stackFind([1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1], 4))
console.log(stackFind([0, 0, 0, 0, 0,1 ,1], 4))
