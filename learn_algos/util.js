// utility funcs
module.exports = util = {
	 genRandCharArr: () => {
	    let randCharArr = [];
	    for (var i = 0; i < 10; i++) {
	        let rand = Math.floor(Math.random() * 26);
	        var char = String.fromCharCode(97 + rand);
	        randCharArr.push(char);
	    }
	    return randCharArr;
	},

	 genRandStr: () => {
	    return util.genRandCharArr().join('');
	},

	 clog: (...str) => {
	    console.log(...str);
	},

	genRandIntArr: (length) => {
		let out = [];
		for (var i = 0; i < length; i++) {
			out.push(Math.floor(Math.random()*10));
		}
		return out;
	}
}
