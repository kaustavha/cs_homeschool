
// Delay min max for applescript
let oneMin = 60,
	fvmin = oneMin*5,
	tenMin = oneMin*10,
	minDelay = oneMin,
    maxDelay = tenMin;

// returns a line of applescript with a random delay in range specified at the top
function genRandDelay(min, max) {
	function getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
	}
	let val = getRandomInt(minDelay,maxDelay);
	return `\n delay ${val} \n`;
}

module.exports = {genRandDelay: genRandDelay};
