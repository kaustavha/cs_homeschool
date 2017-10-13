
// function sln(A) {
// 	var current = 1;
// 	var map = {};
// 	for (var i = 0; i < A.length; i++) {
// 		map[A[i]] = true;
// 		if (current == A[i]) {
// 			current++;
// 			while (map[current]) {
// 				current++;
// 			}
// 		}
// 	}
// 	return current;
// }

// sln([1,3,6,4,1,2]);
// sln([1,2,3]);
// sln([-1, -3]);

// you can write to stdout for debugging purposes, e.g.
// console.log('this is a debug message');

function p(t) {console.log(t);}

function solution(S, K) {
    // write your code in JavaScript (Node.js 6.4.0)
    let words = [], temp='', messages = [], cl=0;
    for (var i = 0; i < S.length; i++) {
    	let char = S[i];
    	if (cl == K) {
    		cl = temp.length;
    		if (words.length == 0) {
    			return -1
    		}
    		messages.push(words.join(" "));
    		words = [];
    	}

    	if (char == " ") {
    		words.push(temp);
    		temp = '';
    	} else {
    		temp += char;
    	}
    	cl++;
    }
    return messages.length;
}


// p(solution("SMS messages are really short", 12));
// p(solution("SMSfajaskfjnasjfnasjfnasfkjasfasf", 12));

// p(solution("SMS messages are really short SMSfajaskfjnasjfnasjfnasfkjasfasf", 12));
	// if (line.indexOf(".mp3") > -1 || line.indexOf(".aac") > -1 || line.indexOf(".flac") > -1) {

	// 	}
// you can write to stdout for debugging purposes, e.g.
// console.log('this is a debug message');

function solution(S) {
let music = {"mp3":true, "aac":true, "flac":true},
		image = {"jpg":true,"bmp":true,"gif":true},
		movie = {"mp4":true,"avi":true,"mkv":true};
	let musicd = 0, imgd = 0, movied=0,otherd=0;


	let lines = S.split('\n');
	for (var i = 0; i < lines.length; i++) {
		let line = lines[i];
		let spaceI = line.indexOf(" "),
			extStartI = line.lastIndexOf("."),
			bi = line.lastIndexOf("b");
		let ext = line.substring(extStartI+1, spaceI),
		    size = parseInt(line.substring(spaceI+1,bi));
	    // console.log(line);
     //    console.log(ext, size);
		if (music[ext]) {
			musicd += size;
		} else if (image[ext]) {
			imgd += size;
		} else if (movie[ext]) {
			movied += size;
		} else {
			otherd += size;
		}

	}
	let out = [
				"music " + musicd + "b",
				"images " + imgd + "b",
				"movies " + movied + "b",
				"other " + otherd + "b"
			  ].join("\n");
	return out;

}




// you can write to stdout for debugging purposes, e.g.
// console.log('this is a debug message');

function solution(S) {
    // write your code in JavaScript (Node.js 6.4.0)
    let lines = S.split('\n'), 
    	total=0,
    	map = {},
    	maxDur = 0, 
    	maxNum = 0, 
    	costMap = {};

    for (var i = 0; i < lines.length; i++) {
    	let line = lines[i],
    		args = line.split(","),
    		duration = time2secs(args[0]),
    		num = num2int(args[1]);

    	// keep track of total call durations for promo
    	if (map[num]) {
    		map[num] += duration;
    	} else {
    		map[num] = duration;
    	}

    	if (maxDur < map[num]) {
    		maxDur = map[num];
    		maxNum = num;
    	} else if (maxDur == map[num]) {
    		if (num < maxNum) {
    			maxNum = num;
    		}
    	}

    	// calc n track cost
    	if (!costMap[num]) {
    		costMap[num] = 0;
    	}

    	if (duration < 300) {
    		costMap[num] += 3*duration;
    	} else {
    		costMap[num] += 150*Math.ceil(duration/60);
    	}
    }

    // we got free call @ maxnum so delete it from map and calc
    delete map[maxNum];
    delete costMap[maxNum];
    for (var key in costMap) {
    	let cost = costMap[key];
    	total += cost;
    }
    return total;

}

function num2int(n) {
	return parseInt(n.split("-").join(""));
}

function time2secs(t) {
	var a = t.split(':'); // split it at the colons
// minutes are worth 60 seconds. Hours are worth 60 minutes.
	return (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
}






































