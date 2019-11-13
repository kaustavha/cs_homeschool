// dedupe an array and also cast everything to lowercase
function dedupeArr(arr) {
    let o = {},
        o2 = [];
    if (arr.length == 0) return arr;
    for (var i = 0; i < arr.length; i++) {
        o[arr[i].toLowerCase()] = true;
    }
    for (let k in o) {
        o2.push(k);
    }
    return o2;
}

// returns a line of applescript with a random delay in range specified at the top
function genRandDelay(minDelay, maxDelay) {
	function getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
	}
	let val = getRandomInt(minDelay, maxDelay);
	return `\ndelay ${val} \n`;
}


function grabSalary(blk) {
	let lines = blk.split('\n');
	if (!lines || lines.length < 3) return;
	let salary = lines[2].match(/\$\d+/);
	if (salary && lines[2].match(/\d+/) >= 100) {
		return lines[2].match(/\$\d+/) + ' == ' + lines[2];
	}
	let ret = blk.match(/\$\d*/) ? blk.match(/\$\d*/) + '=====' + blk : false;
	return ret;
}

function getIsRemoteParser({torontoAndRemoteOnly, includeCanada, includeusa, debug}) {
    return (blk) => isRemote(blk, debug, torontoAndRemoteOnly, includeCanada, includeusa)
}

function isRemote(blk, debug, torontoAndRemoteOnly, includeCanada, includeusa) {
	if (debug) console.log('isRemote', blk.length, includeCanada, includeusa, torontoAndRemoteOnly, blk.match(/remote/gi))
	if (torontoAndRemoteOnly) {
		if (blk.match(/toronto/gi))
			return blk;
		if (blk.match(/remote/gi)
			&& (!blk.match(/\(US\)/gi) || !blk.match(/\(US only\)/gi) || !blk.match(/\(U.S. only\)/gi))
			&& !blk.match(/\(EU\)/gi)
			&& ((blk.match(/\|/gi)) || (blk.match(/location/gi))))
			return blk;
		return false;
	}
	if (blk.match(/remote/gi))
		return blk;
	if (includeCanada)
		if (blk.match(/toronto/gi) || blk.match(/canada/gi) || blk.match(/vancouver/gi) || blk.match(/montreal/gi)
			|| blk.match(/\smtl\s/gi))
			return blk;
	if (includeusa)
		if ((blk.match(/san francisco/gi) || blk.match(/new york/gi) ||
			blk.match(/\sny\s/gi) || blk.match(/\snyc\s/gi) || blk.match(/\ssf\s/gi) || blk.match(/boston/gi) ||
			blk.match(/seattle/gi)) && blk.match(/visa/gi))
			return blk;

	return false;
}


module.exports = {
    genRandDelay: genRandDelay,
    getIsRemoteParser: getIsRemoteParser,
    dedupeArr: dedupeArr,
    isRemote: isRemote,
    grabSalary: grabSalary
}