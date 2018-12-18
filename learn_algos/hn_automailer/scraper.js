const jsdom = require('jsdom');
const $ = require('jquery')(new jsdom.JSDOM().window);
const https = require('https');

function getHNPosts(pageN, fetchFromHN, jobsListfs, hnurlid) {
	pageN = pageN || 1;
	let oldDat = '', 
		fullDat = '';
	return new Promise(res => {
		if (!fetchFromHN) return res();
		return _getHNPosts(pageN, hnurlid, hnurlid).then(dat => {
			if (dat == oldDat) {
				console.log('hi2')
				fs.writeFileSync(jobsListfs, fullDat);
				return res();
			}
			console.log('hi')
			fullDat += dat;
			oldDat = dat;
			pageN++;
			return getHNPosts(pageN).then(() => res());
		});
	});
}

function _getHNPosts(pageN, hnurlid) {
	let url = `https://news.ycombinator.com/item?id=${hnurlid}&p=${pageN}`;
	return new Promise(res => {
		extractContent(url).then(dat => {
			let buf = '';
			commtext = stripChildComments(dat);
			$.each( commtext, function( key, value ) {
				buf += htmlDecodeWithLineBreaks($(value).html());
			});
			res(buf);
		})
	})
}

function stripChildComments(dat) {
	html = $(dat);
	comments = html.find('.comtr');
	let res = [];
	$.each(comments, (k, v) => {
		if ($(v).find('img')) {
			let img = $(v).find('img').get(0);
			if (img.width == 0) {
				let ctext = $(v).find('.commtext').get(0);
				if (!ctext) return;
				ctext.prepend('ago [-]');
				ctext.append('\n\n');
				res.push(ctext);
				// console.log(ctext)
			}
		}
	});
	return res;
}

function extractContent(url) {
		let dat = '';
		return new Promise(resolve => {
			https.get(url, res => {
				res.on('data', function( data ) {
					dat += data;
				});
				res.on('end', () => {
					resolve(dat);
				});
		
			});
		});
}

// pollyfill
function htmlDecodeWithLineBreaks(html) {
	var breakToken = '_______break_______',
		lineBreakedHtml = html.replace(/<br\s?\/?>/gi, breakToken).replace(/<p\.*?>(.*?)<\/p>/gi, breakToken + '$1' + breakToken);
	return $('<div>').html(lineBreakedHtml).text().replace(new RegExp(breakToken, 'g'), '\n');
}

module.exports = {
	getHNPosts: getHNPosts
};