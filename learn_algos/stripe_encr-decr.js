
/*
 * Complete the function below.
 */

 // stripe
 // given input like:
// 2
// API: amount=301&card=5656565656565656
// BANK: card=565656XXXXXXXXXXXXXXXXXXXX5656&authorize=true
// return 
// API: amount=301&card=565656XXXXXXXXXXXXXXXXXXXX5656
// BANK: card=5656565656565656&authorize=true

    var naivecache = {};
function replace(lines) {
	let outArr = [];
	for (var i = 0; i < lines.length; i++) {
		let tl = lines[i],
			tlarr = tl.split(' '),
			type = tlarr[0],
			dat = tlarr[1],
			carnum, out, i1;

			if (type.indexOf('API:') > -1) {
				i1 = dat.indexOf('card=') + 5;

				if (i1+15 == dat.length || dat[i1+15] == "&") {
					carnum = dat.substring(i1, i1+15);
				} else if (i1+16 == dat.length || dat[i1+16] == "&") {
					carnum = dat.substring(i1, i1+16);
				}
				out = encrypt(carnum+'');
			} else if (type.indexOf('BANK:') > -1) {
				i1 = dat.indexOf('card=') + 5;
				carnum = dat.substring(i1, i1+30);
				out = decrypt(carnum+'');
			}

			let outStr = tl.replace(carnum, out);
			outArr.push(outStr);
	}
	return outArr;
}

function encrypt(line) {
	let bufstr = '';
	for (var i = 0; i < 20; i++) {
		bufstr += 'X';
	}
	// make sure theyre strings
	let l1 = line.substring(0, 6) + '',
		l2 = line.substring(line.length-4, line.length) + '',
		l3 = l1 + l2,
		l4 = l1 + bufstr + l2;

	naivecache[l3] = line;

	return l4;
	// cardnumber, store 1st 6 and last 4
}

function decrypt(line) {
	let l1 = line.substring(0, 6) + '',
		l2 = line.substring(line.length-4, line.length) + '',
		l3 = l1 + l2;
	if (naivecache[l3]) return naivecache[l3];
	return line;
}