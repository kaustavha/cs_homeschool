/**
 * Description:
 * This is a hacker news who's hiring auto mailer
 * Steps:
 * - Fetch all posts from a hacker news who's hiring thread given the id i.e. item?id=xxx in the url
 * - Strip off all child comments
 * - Get text content of all remaining comments while preserving line breaks
 * - Write this to file in {year}/jobs_m{month number}.txt
 * - Attempt to parse emails from the text blocks using 2 passes:
 *   -- Lighter first pass, iter lines, looks for common keywords in the line like `contact me at..` and attempt to pull out a plain email
 * 		or an encoded email such as `joe at company dot com` and convert back to normal
 *   -- More aggressive second pass if we didnt find an email, try converting all ats and dots to symbols and such
 * - Parse any matching keywords in the post based on a provided hashmap hand written from our resume
 * - Check if the job is remote or in canada (flag dependent)
 * - For all blocks/jobs that meet our criteria (remote/canada/keyword matches) generate applescript
 * - Generated applescript contains a small cover letter with info about matched keywords, and paras for blockchain and open source if they match too
 * - Generated applescript also contains a random delay within a hardcoded range
 * - This script will also write out to file information about:
 * 	-- jobs where we failed to parse emails
 *  -- higher priority (remote e.g.) rejected jobs
 *  -- jobs where we managed to parse a salary
 * - Running the applescript will automatically send out emails to everyone specified
 */
let argHnUrlId, genStats, curMonth;
const myArgs = process.argv.slice(2);
if (myArgs.length > 0) {
	// 1st arg is hnurl id
	argHnUrlId = myArgs[0];
	genStats = myArgs[0] ? true : false;
	curMonth = myArgs[1] ? myArgs[1] : false;
}

// inputs and flags
const hnurlid = argHnUrlId ? argHnUrlId : '21419536'; // e.g. https://news.ycombinator.com/item?id=18499843 i.e https://news.ycombinator.com/item?id=${hnurlid}
const debug = false; // output console logs at different steps
const remoteOnly = true; // only pull in remote jobs + foll. flags
const torontoAndRemoteOnly = false; // strict mode
const includeCanada = true; // needs the above flag to be true, also adds in jobs in canada
const includeusa = true; // same as above but city keywords for the states
const fetchFromHN = true; // Run a fresh fetch from HN, otherwise we expect a file to exist from an old run
const keywordMatchOnly = true; // Only write applescript emails for jobs where we have keyword matches

let stats = {
	py: 0,
	js: 0,
	eth: 0
}

// Dates for creating filenames
const date = new Date(),
	month = curMonth ? curMonth : date.getMonth() + 1,
	yr = date.getFullYear();

const jobsList = `${yr}/jobs_m${month}`,
	jobsListfs = jobsList + '.txt',
	// jobsListfs = '2018/jobstest.txt',
	sentEmailsfs = jobsList + '_emailsbackup_alreadysent.txt',
	outputApplScriptfs = jobsList + '_final.applescript',
	tstAs = outputApplScriptfs.split('.').join('_test.'),
	rejectsfs = jobsList + '_rejects.txt',
	rawEmailListfs = jobsList + '_emails.txt',
	salariesFs = jobsList + '_salaries.txt',
	remoteFs = jobsList + '_remotes.txt',
	remoteJobsRejectsFs = jobsList + '_remotes_rejects.txt';

const fs = require('fs');
const https = require('https');
const jsdom = require('jsdom');
$ = require('jquery')(new jsdom.JSDOM().window);
const _genAS = require('./lib/generate_applescript');
const genAS = (obj, trialRun) => {
	return _genAS(obj, trialRun, {
		month: month,
		yr: yr,
		stats: stats
	})
}
// Delay min max for applescript
let oneMin = 60,
	fvmin = oneMin * 5,
	tenMin = oneMin * 10,
	minDelay = oneMin,
	maxDelay = fvmin;

// vars for fetching hn jobs txt
let oldDat = '', fullDat = '';

// data stores for outputs
let blocks = [],
	emails = [],
	allroles = [],
	salaries = [],
	remoteJobs = [],
	rejects = [],
	remoteJobsRejects = [];

// try to grab a list of successfully parsed/sent emails so we dont email people twice
let sentEmails;
if (fs.existsSync(sentEmailsfs)) {
	sentEmails = fs.readFileSync(sentEmailsfs, 'utf8').split('\n');
} else {
	sentEmails = [];
}

// block level vars used when parsing job descr blocks
let block = false,
	blockbuf = '',
	roles = [],
	postername,
	matcheskeywords = 0;


// let blk = `

// Sonder | San Francisco, CA & Montreal, Canada | Onsite | Full-time | https://www.sonder.com
// Sonder is transforming the future of hospitality. We are building the operating system for the future of the hospitality industry. Technology is at the core of powering the platform for the world's first deconstructed hotel and we are the first to do it. We recently raised our Series D at a $1B+ valuation. We are growing rapidly and looking for talented engineers to join us on this journey.

// Director of Engineering: https://grnh.se/dc062bb52

// Machine Learning Engineer: https://grnh.se/8ee2652e2

// Senior Data Scientist: https://grnh.se/e3e5bc662

// Senior Software Engineer: https://grnh.se/7ad3cb202

// Senior DevOps Engineer: https://grnh.se/e41290792

// Senior Software Engineer (MTL): https://grnh.se/3359a69d2
// Reach out at chris.spada at sonder.com with any questions`
// console.log(parseEmailFromBlock(blk), parseBuzzwords(blk), isRemote(blk), isRemote(blk))
// return
getHNPosts(1).then(x => {
	main();
});

function main() {
	populateBlocks();
	let asc = genAsAll(blocks);
	console.log('emails ', emails.length);
	console.log('rejects ', rejects.length);
	console.log('keyword matches ', matcheskeywords);
	console.log('remote ', remoteJobs.length);
	console.log('remote rejects', remoteJobsRejects.length);
	//  MAIN FILE OUTPUTS ===========================>
	let tb = blocks[0];
	tb.e = ["hi@kaustav.me", "kausthal@gmail.com", "hi@kaustav.me"];
	fs.writeFileSync(tstAs, genAS(tb, true));

	fs.writeFileSync(outputApplScriptfs, asc);
	fs.writeFileSync(rejectsfs, rejects.join("\n"));
	fs.writeFileSync(rawEmailListfs, emails.join("\n"));
	fs.writeFileSync(salariesFs, salaries.join("\n"));
	fs.writeFileSync(remoteFs, remoteJobs.join('\n'));
	fs.writeFileSync(remoteJobsRejectsFs, remoteJobsRejects.join("\n"));

	if (genStats) {
		console.log(stats)
	}

	console.log("Done");
	return Promise.resolve();
}
//========================================= End
// Functions

function populateBlocks() {
	let txt = fs.readFileSync(jobsListfs, 'utf8');
	let lines = txt.split('\n');
	for (var i = 0; i < lines.length; i++) {
		let tl = lines[i];
		if (tl.indexOf('ago [-]') > -1 || i == lines.length - 1 || tl.indexOf('|') > -1) {

			if (!block) {
				block = true;
			} else if (blockbuf.length > 10) {
				// new block
				let etxt = parseEmailFromBlock(blockbuf),
					keywords = parseBuzzwords(blockbuf);

				// generate keyword match stats
				if (keywords.length) matcheskeywords++;

				if (genStats) {
					// how many jobs w/ matching keywords
					if (keywords.indexOf('python') > -1) stats.py++;
					if (keywords.indexOf('javascript') > -1) stats.js++;
				}

				// prioritize jobs that list salary
				let slr = grabSalary(blockbuf);
				if (slr) salaries.push(slr);

				// if (etxt[0] == 'null') console.log(blockbuf);
				if (etxt.length > 0 && etxt[0] != 'null' && etxt[0] != 'blacklist' &&
					// desperate for remote jobs, but dont apply to others if we dont have keyword match
					(keywordMatchOnly ? keywords.length > 0 : true) &&
					// remote only search flag
					(remoteOnly ? isRemote(blockbuf) : true)) {

					// grab and prioritize remote jobs
					if (isRemote(blockbuf)) remoteJobs.push(blockbuf);

					emails.push(etxt.join(","));
					if (roles.length > 0) {
						roles = roles[0];
						roles = roles.split(',');
						allroles = allroles.concat(roles);
					}
					blocks.push({
						e: etxt,
						txt: 'blockbuf',
						r: roles,
						n: postername,
						k: keywords
					});
				} else {
					let blockStats = blockbuf.concat(
						'\n',
						blockbuf.length ? ` | len: ${blockbuf.length} | ` : '| empty block |',
						keywords.length > 0 ? keywords : 'no keyword match',
						(isRemote(blockbuf) === false ? ' remote: false ' : ' remote: true '),
						etxt && etxt.length > 0 ? etxt : 'no email',
						'\n'
					);
					rejects.push(blockStats);

					// grab and prioritize remote jobs we missed for manual
					if (isRemote(blockbuf) !== false
						&& ((!etxt || etxt.length === 0 || etxt[0] == 'null') && etxt[0] !== 'blacklist')
						&& (keywordMatchOnly ? keywords.length > 0 : true)) {
						remoteJobsRejects.push(blockStats);
					}
				}
				postername = null;
				blockbuf = '';
				roles = [];
			}
			// set postername
			postername = tl.split(/\s+/)[0];
		}
		if (block) {
			blockbuf += tl + '\n';
			if (tl.match(/\|/)) roles.push(tl);
		}
	}
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

function isRemote(blk) {
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

function parseEmailFromBlock(t, iteration) {
	let emailRx = /[a-z0-9\.\@\-\_\+\{\}\(\)]+/gi;
	let l = t.split('\n'),
		buf = '';
	for (var i = 0; i < l.length; i++) {
		let tl = l[i];
		let words = tl.match(emailRx);
		if (debug) console.log('Words matched using emailRx: ', words);

		if (!words) words = [];
		for (var j = 0; j < words.length; j++) {
			let word = words[j],
				tb = '';

			if (word.match(/email/gi) ||
				word.match(/e-mail/gi)) {
				let start = j < 0 ? 0 : j,
					end = j + 20 > words.length ? words.length : j + 20;
				tb += words.slice(start, end).join(" ");

			} else if (word.match(/\[at\]/gi) ||
				word.match(/\(at\)/gi) ||
				word.match(/\<at\>/gi) ||
				word.match(/\_at\_/gi) ||
				word.match(/\{at\}/gi) ||
				word.indexOf("@") > -1) {
				if (debug) console.log('at', word);
				let start = j - 5 < 0 ? 0 : j - 5,
					end = j + 5 > words.length ? words.length : j + 5;
				tb += words.slice(start, end).join(" ");
			} else if (word.match(/\[dot\]/gi) ||
				word.match(/\(\dot\)/gi) ||
				word.match(/\s*dot\s*/gi) ||
				word.match(/\s*\[\.\]\s*/gi) ||
				word.match(/\<dot\>/gi) ||
				word.match(/\{dot\}/gi) ||
				word.match(/\<.\>/gi) ||
				word.match(/\{.\}/gi) ||
				word.match(/\s*\(\.\)\s*/gi)) {
				if (debug) console.log('dot', word);
				let start = j - 5 < 0 ? 0 : j - 5,
					end = j + 5 > words.length ? words.length : j + 5;

				tb += words.slice(start, end).join(" ");
			}

			if (tb.length > 0 && debug) console.log('1', tb);
			tb = parseLine1(tb);
			buf += " " + tb;
		}

	}

	buf = buf.trim();
	let posems = [];
	// further process valid emails
	if (buf.indexOf('@') > -1 && buf.indexOf(".") > -1) {
		let ws = buf.match(emailRx);
		for (var i = 0; i < ws.length; i++) {
			let w = ws[i];
			if (w.indexOf('@') > -1 && w.indexOf(".") > -1) {

				if (w.length > 0 && debug) console.log('further processing', w);
				if (w.match(/@/gi).length > 1) {
					w = w.split("@").splice(1, 2).join("@");

					if (w.length > 0 && debug) console.log('further processing', w);
					// w = w.match(/[a-z]+.*\@[a-z]+/gi) + w.match(/\.[a-z]+/gi);
				}

				if (w.length > 0 && debug) console.log('further processing', w);
				w = w.match(/[a-z0-9\.\-\_\+]+\@[a-z0-9\-\.]+\.+[a-z0-9]+/gi) + '';

				if (w.length > 0 && debug) console.log('further processing', w);
				// filter out common false matches and people using gmail
				if (!w.match(/name/) && !w.match(/http/) && !w.match(/www/) && !w.match(/hotmail/)
					&& !w.match(/gmail/)) {
					posems.push(w);
				}
			}
		}
	}

	if (posems.length == 0) {
		if (iteration == null || iteration == undefined || iteration < 1) posems = parseEmailFromBlock(parseLine2(t), 1);
	}

	for (let index = 0; index < posems.length; index++) {
		let w = posems[index];
		if (w.match(/.com/)) w.replace(/.com[a-z]+/, '.com ');
		if (w !== 'null' && w) {
			posems[index] = w;
		} else {
			posems.splice(index, 1);
		}
	}

	// do not email peope again************************************
	//IMPORTANT
	// simple check for distinct email then more complex check for company name
	posems = dedupeArr(posems);
	let out = [];
	if (sentEmails.indexOf(posems.join(",")) === -1) out = posems;

	let companyListSentEmails = {};
	sentEmails.forEach(element => {
		companyListSentEmails[element.split('@')[1]] = true;
	});
	if (posems && posems[0] && companyListSentEmails[posems[0].split('@')[1]] ||
		emails.indexOf(posems.join(",")) !== -1) out = ['blacklist'];


	return out;
}

function parseLine1(tb) {
	tb = tb.replace(/\s*\[at\]\s*/gi, '@');
	tb = tb.replace(/\s*\[@\]\s*/gi, '@');
	tb = tb.replace(/\s*\(at\)\s*/gi, '@');
	tb = tb.replace(/\s*\<at\>\s*/gi, '@');
	tb = tb.replace(/\s*\{at\}\s*/gi, '@');
	tb = tb.replace(/\s*\(@\)\s*/gi, '@');
	tb = tb.replace(/\s\@\s/gi, '@');

	tb = tb.replace(/\s*\[dot\]\s*/gi, '.');
	tb = tb.replace(/\s*\(dot\)\s*/gi, '.');
	tb = tb.replace(/\s*\(\.\)\s*/gi, '.');
	tb = tb.replace(/\s*\[\.\]\s*/gi, '.');
	tb = tb.replace(/\s*\<dot\>\s*/gi, '.');
	tb = tb.replace(/\s*\{dot\}\s*/gi, '.');
	tb = tb.replace(/\s*\<\.\>\s*/gi, '.');
	tb = tb.replace(/\s*\{\.\}\s*/gi, '.');
	return tb;
}

function parseLine2(tb) {
	if (debug) console.log('parseline2 start', tb);

	tb = tb.replace(/\s*\[dot\]\s*/gi, '.');
	tb = tb.replace(/\s*\(\s*dot\s*\)\s*/gi, '.');
	tb = tb.replace(/\s*\(\.\)\s*/gi, '.');
	tb = tb.replace(/\s*\[\.\]\s*/gi, '.');
	tb = tb.replace(/\s*\<dot\>\s*/gi, '.');
	tb = tb.replace(/\s*\{dot\}\s*/gi, '.');
	tb = tb.replace(/\s*\<\.\>\s*/gi, '.');
	tb = tb.replace(/\s*\{\.\}\s*/gi, '.');
	tb = tb.replace(/\s+dot\s+/gi, '.');

	tb = tb.replace(/\s*\[at\]\s*/gi, '@');
	tb = tb.replace(" __4t__ ", '@');
	tb = tb.replace(/\s+at\s+/gi, '@');
	tb = tb.replace(/\s*\[@\]\s*/gi, '@');
	tb = tb.replace(/\s*\(\s*at\s*\)\s*/gi, '@');
	tb = tb.replace(/\s*\<at\>\s*/gi, '@');
	tb = tb.replace(/\s*\{at\}\s*/gi, '@');
	tb = tb.replace(/\s*\(@\)\s*/gi, '@');
	tb = tb.replace(/\s\@\s/gi, '@');

	// thx dalan...
	tb = tb.replace(/\s*chr\(43\)\s*/, '+');
	tb = tb.replace(/\s*chr\(64\)\s*/, '@');
	tb = tb.replace(/\s*chr\(46\)\s*/, '.');

	if (debug) console.log('parseLine2 done', tb, '\n');
	return tb;
}

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

function parseBuzzwords(txt) {
	let keywords = [
		"python", "ruby", "java", "c++", "lua", "bash", "shell", "scripting",
		"mongo", "mongodb", "mysql", "sql", "hadoop", "hive",
		"kafka", "grafana", "zookeeper",
		"chef", "ansible", "travis", "jenkins", "kubernetes",
		"rails", "coffeescript",
		"bootstrap", "nodejs",
		"blockchain", "ethereum", "solidity", "hyperledger",
		"redis", "node", "php", "rails",
		"backend", "web", "mobile", "REST", "cassandra", "frontend", "fullstack",
		"linux", "nginx", "apache", "open source"
	];

	let keywordsMap = {
		"AWS": ['aws', 'amazon'],
		'docker': ['docker', 'containers'],
		'javascript': ['es6', 'js', 'javascript', 'es7', 'esnext'],
		'react': ['react', 'reactjs', "react-native", 'redux', 'mobex'],
		'angular': ['angular', 'angularjs'],
		'frontend': ['front-end', 'frontend'],
		'go': ['golang', 'go'],
		'elk': ['kibana', 'logstash', 'elasticsearch'],
		'devops': ['devops', 'chef', 'ansible', 'travis', 'jenkins', 'kubernetes', 'docker', 'terraform', 'kubernetes']
	}

	let words = txt.replace('-', '').match(/[a-z]+/gi),
		out = [];

	for (var i = 0; i < words.length; i++) {
		let twlc = words[i].toLowerCase();

		if (keywords.indexOf(twlc) != -1) out.push(keywords[keywords.indexOf(twlc)]);

		for (let key in keywordsMap) {
			if (keywordsMap[key].indexOf(twlc) != -1) out.push(key);
		}
	}

	// match open source
	if (txt.match(/open source/gi)) out.push('opensource');
	return dedupeArr(out);
}

// generate applescript
function genAsAll(obj) {
	let c = '';
	for (let ki in obj) {
		c += genAS(obj[ki]);
		c += genRandDelay();
	}
	return c;
}

// returns a line of applescript with a random delay in range specified at the top
function genRandDelay() {
	function getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
	}
	let val = getRandomInt(minDelay, maxDelay);
	return `\ndelay ${val} \n`;
}

function getHNPosts(pageN) {
	pageN = pageN || 1;
	return new Promise(res => {
		if (!fetchFromHN) return res();
		return _getHNPosts(pageN).then(dat => {
			if (dat == oldDat) {
				if (debug) console.log('got all posts from hn');
				try {
					fs.mkdirSync('./' + yr);
				} catch (e) { }
				fs.writeFileSync(jobsListfs, fullDat);
				return res();
			}
			fullDat += dat;
			oldDat = dat;
			pageN++;
			return getHNPosts(pageN).then(() => res());
		});
	})
}

function _getHNPosts(pageN) {
	let url = `https://news.ycombinator.com/item?id=${hnurlid}&p=${pageN}`;
	return new Promise(res => {
		extractContent(url).then(dat => {
			let buf = '';
			let commtext = stripChildComments(dat);
			$.each(commtext, function (key, value) {
				buf += htmlDecodeWithLineBreaks($(value).html());
			});
			res(buf)
		})
	})
}

function swapHtmlTextWithFullRefLinks(dat) {
	let links = $(dat).find('a');
	if (!links) return;
	$.each(links, (k, v) => {
		let url = $(v).attr('href');
		if (url.match('http')) {
			$(v).text(function () {
				return url;
			});
		}
	});
	return dat;
	// break;
}

function stripChildComments(dat) {
	let html = $(dat);
	let comments = html.find('.comtr');
	let res = [];
	$.each(comments, (k, v) => {
		if ($(v).find('img')) {
			let img = $(v).find('img').get(0);
			if (img.width == 0) {
				// ctext is HTMLSpanElement {}
				let ctext;
				ctext = $(v).find('.commtext').get(0);
				if (ctext) {
					try {
						ctext = swapHtmlTextWithFullRefLinks(v);
						// ctext = ctext.get(0);
						ctext = $(ctext).find('.commtext').get(0)
						ctext.prepend('\n\n');
						ctext.prepend('ago [-]');
						ctext.append('\n\n');
						res.push(ctext);
					} catch (e) {
						// bye
					}
				}
			}
		}
	});
	return res;
}

function extractContent(url) {
	let dat = '';
	return new Promise(resolve => {
		https.get(url, res => {
			res.on('data', function (data) {
				dat += data;
			});
			res.on('end', () => {
				resolve(dat);
			})
		});
	})
}

// pollyfill
function htmlDecodeWithLineBreaks(html) {
	var breakToken = '_______break_______',
		lineBreakedHtml = html.replace(/<a>(.*?)<a\/>/gi, '$1').replace(/<br\s?\/?>/gi, breakToken).replace(/<p\.*?>(.*?)<\/p>/gi, breakToken + '$1' + breakToken);
	// console.log(html, $('<div>').html(lineBreakedHtml).text().replace(new RegExp(breakToken, 'g'), '\n'))
	return $('<div>').html(lineBreakedHtml).text().replace(new RegExp(breakToken, 'g'), '\n');
}
