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


// inputs and flags
const hnurlid = '19055166'; // e.g. https://news.ycombinator.com/item?id=18499843 i.e https://news.ycombinator.com/item?id=${hnurlid}
const debug = false; // output console logs at different steps
const remoteOnly = true; // only pull in remote jobs
const includeCanada = true; // needs the above flag to be true, also adds in jobs in canada
const includeusa = false;
const fetchFromHN = true; // Run a fresh fetch from HN, otherwise we expect a file to exist and just that
const keywordMatchOnly = false; // Only write applescript emails for jobs where we have keyword matches

// Dates for creating filenames
const date = new Date(),
	month = date.getMonth(),
	yr = date.getFullYear();

const jobsList = `${yr}/jobs_m${month}`,
	jobsListfs = jobsList + '.txt',
	// jobsListfs = '2018/jobstest.txt',
	sentEmailsfs = jobsList + '_emailsbackup_alreadysent.txt',
	outputApplScriptfs = jobsList + '_final.applescript',
	tstAs = outputApplScriptfs + '.test',
	rejectsfs = jobsList+'_rejects.txt',
	rawEmailListfs = jobsList+'_emails.txt',
	salariesFs = jobsList+'_salaries.txt',
	remoteFs = jobsList+'_remotes.txt',
	remoteJobsRejectsFs = jobsList+'_remotes_rejects.txt';

const fs = require('fs');
const https = require('https');
var jsdom = require('jsdom');
$ = require('jquery')(new jsdom.JSDOM().window);

// Delay min max for applescript
let oneMin = 60,
	fvmin = oneMin*5,
	tenMin = oneMin*10,
	minDelay = fvmin,
	maxDelay = tenMin;

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


getHNPosts(1).then(x => {
	main();
});

function main() {
	populateBlocks();
	// blocks = dedupeObj(blocks, 'e');
	let asc = genAsAll(blocks);
	// console.log(i);
	// console.log(rejects);
	// console.log(emails);
	// console.log(emails);
	// console.log(blocks);
	// console.log(dedupeArr(allroles));
	// console.log(genAsAll(blocks));
	// console.log(lines);
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
}
//========================================= End
// Functions

function populateBlocks() {
	let txt = fs.readFileSync(jobsListfs);
	txt += '';
	let lines = txt.split('\n');
	for (var i = 0; i < lines.length; i++) {
		let tl = lines[i];
		if (tl.indexOf('ago [-]') > -1 || i == lines.length - 1 || tl.indexOf('|') > -1) {

			if (!block) {
				block = true;
			} else {
				// new block
				let etxt = parseEmailFromBlock(blockbuf),
					keywords = parseBuzzwords(blockbuf);
				
				// generate keyword match stats
				if (keywords.length) matcheskeywords++;

				// prioritize jobs that list salary
				let slr = grabSalary(blockbuf);
				if (slr) salaries.push(slr);

				// grab and prioritize remote jobs
				if (isRemote(blockbuf)) remoteJobs.push(blockbuf);

				// if (etxt[0] == 'null') console.log(blockbuf);
				if (etxt.length > 0 && etxt[0] != 'null' && 
					// desperate for remote jobs, but dont apply to others if we dont have keyword match
					(keywordMatchOnly ? keywords.length > 0 : true) &&
					// remote only search flag
					(remoteOnly ? isRemote(blockbuf) : true)) {
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
					rejects.push(blockbuf);

					// grab and prioritize remote jobs we missed
					if (isRemote(blockbuf)) remoteJobsRejects.push(blockbuf);
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
	let ret = blk.match(/\$\d*/) ?  blk.match(/\$\d*/) + '====='+  blk : false;
	return ret;
}

function isRemote(blk) {
	if (blk.match(/remote/gi) && blk.match(/\|/gi))
		return blk;
	if (includeCanada)
		if (blk.match(/toronto/gi) || blk.match(/canada/gi) || blk.match(/vancouver/gi) || blk.match(/montreal/gi))
			return blk;
	if (includeusa) {
		if (blk.match(/san francisco/gi) || blk.match(/new york/gi) ||
		blk.match(/ny/gi) || blk.match(/nyc/gi) || blk.match(/sf/gi) || blk.match(/boston/gi) ||
		blk.match(/atlanta/gi) ||
		blk.match(/seattle/gi)) {
			return blk;
		}
	}
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
				word.match(/\{at\}/gi) ||
				word.indexOf("@") > -1) {
				if (debug) console.log('at', word);
				let start = j - 5 < 0 ? 0 : j - 5,
					end = j + 5 > words.length ? words.length : j + 5;
				tb += words.slice(start, end).join(" ");
			} else if (word.match(/\[dot\]/gi) ||
				word.match(/\(dot\)/gi) ||
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

			tb = tb.replace(/\s+at\s+/gi, '@');
			tb = tb.replace(/\s*\[at\]\s*/gi, '@');
			tb = tb.replace(/\s*\[@\]\s*/gi, '@');
			tb = tb.replace(/\s*\(at\)\s*/gi, '@');
			tb = tb.replace(/\s*\<at\>\s*/gi, '@');
			tb = tb.replace(/\s*\{at\}\s*/gi, '@');
			tb = tb.replace(/\s*\(@\)\s*/gi, '@');
			tb = tb.replace(/\s\@\s/gi, '@');

			// tb = tb.replace(/\s*dot\s*/gi, '.');
			tb = tb.replace(/\s*\[dot\]\s*/gi, '.');
			tb = tb.replace(/\s*\(dot\)\s*/gi, '.');
			tb = tb.replace(/\s*\(\.\)\s*/gi, '.');
			tb = tb.replace(/\s*\[\.\]\s*/gi, '.');
			tb = tb.replace(/\s*\<dot\>\s*/gi, '.');
			tb = tb.replace(/\s*\{dot\}\s*/gi, '.');
			tb = tb.replace(/\s*\<\.\>\s*/gi, '.');
			tb = tb.replace(/\s*\{\.\}\s*/gi, '.');

			// fuck you jeff
			tb = tb.replace(" __4t__ ", '@');

			if (tb.length > 0 && debug) console.log('2', tb);
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
				if (w.match(/@/gi).length > 1) {
					w = w.split("@").splice(1, 2).join("@");
					w = w.match(/[a-z]+.*\@[a-z]+/gi) + w.match(/\.[a-z]+/gi);
				}

				if (w.length > 0 && debug) console.log('1', w);
				w = w.match(/[a-z0-9\.\-\_\+]+\@[a-z0-9\-\.]+\.+[a-z0-9]+/gi) + '';

				// filter out common false matches and people using gmail
				if (!w.match(/name/) && !w.match(/http/) && !w.match(/www/)
					&& !w.match(/gmail/)) posems.push(w);
			}
		}
	}

	if (posems.length == 0) {
		if (!iteration == 1) posems = parseEmailFromBlock(parseLine2(t), 1);
	}

	for (let index = 0; index < posems.length; index++) {
		const w = posems[index];
		if (w.match(/.com/)) w.replace(/.com[a-z]+/, '.com');
		if (w !== 'null' && w) posems[index] = w;
	}
	// do not email peope again************************************
	//IMPORTANT
	posems = dedupeArr(posems);
	let out = [];
	if (sentEmails.indexOf(posems.join(",")) === -1) out = posems;
	if (emails.indexOf(posems.join(",")) !== -1) out = [];
	
	return out;
}

function parseLine2(tb) {
	if (debug) console.log('parseline2 start', tb);

	tb = tb.replace(/\s*\[dot\]\s*/gi, '.');
	tb = tb.replace(/\s*\(dot\)\s*/gi, '.');
	tb = tb.replace(/\s*\(\.\)\s*/gi, '.');
	tb = tb.replace(/\s*\[\.\]\s*/gi, '.');
	tb = tb.replace(/\s*\<dot\>\s*/gi, '.');
	tb = tb.replace(/\s*\{dot\}\s*/gi, '.');
	tb = tb.replace(/\s*\<\.\>\s*/gi, '.');
	tb = tb.replace(/\s*\{\.\}\s*/gi, '.');
	tb = tb.replace(/\s+dot\s+/gi, '.');

	tb = tb.replace(/\s*\[at\]\s*/gi, '@');
	tb = tb.replace(/\s+at\s+/gi, '@');
	tb = tb.replace(/\s*\[@\]\s*/gi, '@');
	tb = tb.replace(/\s*\(at\)\s*/gi, '@');
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

// function dedupeObj(arr, key) {
// 	let arr2 = [], outArr = [];
// 	arr.forEach(element => {
// 		arr2.push(element[key]);
// 	});
// 	// for (k, v in arr) {
// 	// 	arr2.push(v[key]);
// 	// }
// 	dedupeArr(arr2);
// 	arr2.forEach(element => {
// 		arr.forEach(origEle => {
// 			if (origEle[key] === element) {
// 				outArr.push(origEle);
// 				return;
// 			}
// 		});
// 	});
// 	console.log(outArr, arr)
// 	return outArr;
	
// }

// dedupe an array and also cast everything to lowercase
function dedupeArr(arr) {
	let o = {},
		o2 = [];
	if (arr.length == 0) return arr;
	// console.log(arr);
	for (var i = 0; i < arr.length; i++) {
		o[arr[i].toLowerCase()] = true;
	}
	for (let k in o) {
		o2.push(k);
	}
	return o2;
}

function parseBuzzwords(txt) {
	let krax = "Go, golang, Lua, JS, Python, Ruby, Java, C++, Bash;  Hadoop, Hive, Kafka, MongoDB, ElasticSearch, Logstash, Kibana, Grafana, Docker, Chef, Travis, Jenkins, Ansible zookeeper".
	match(/[a-z]+/gi),
		kspark = "MongoDB/NoSQL, ExpressJS, AngularJS, NodeJS, Nginx, AWS, javascript. angular, node".match(/[a-z]+/gi),
		python = ["pip", "python", "anaconda"],
		keth = "blockchain ethereum hyperledger solidity truffle".match(/[a-z]+/gi);
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

		for (key in keywordsMap) {
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
	for (ki in obj) {
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
	let val = getRandomInt(minDelay,maxDelay);
	return `\ndelay ${val} \n`;
}

// Amazon, Apple, Evernote, Facebook, Google, LinkedIn, Microsoft, Oracle, any Y Combinator startup, Yelp, and Zynga.
function genAS(obj, trialRun) {

	// Utils for generating applescript
	function addline(txt) {
		content += txt + "\n";
	}

	function checkForOpensourceOrEth(keyword) {
		return keyword === 'opensource' || keth.indexOf(keyword) > -1;
	}

	function match(a1, a2) {
		for (var i = 0; i < a1.length; i++) {
			if (a2.indexOf(a1[i]) > -1) return true;
		}
		return false;
	}
	// End

	let defaultsubject = "HackerNews FT SE opportunities";
	let fcontent = '';

	let krax = "Go, golang, Lua, JS, Python, Ruby, Java, C++, Bash;  Hadoop, Hive, Kafka, MongoDB, ElasticSearch, Logstash, Kibana, Grafana, Docker, Chef, Travis, Jenkins, Ansible zookeeper".
	match(/[a-z]+/gi),
		kspark = "MongoDB/NoSQL, ExpressJS, AngularJS, NodeJS, Nginx, AWS, javascript".match(/[a-z]+/gi),
		python = ["pip", "python", "anaconda"],
		keth = "blockchain ethereum hyperledger solidity truffle".match(/[a-z]+/gi),
		addketh = false,
		addoss = false;

	let content = '';
	let o = obj,
		e = o.e,
		txt = o.txt,
		r = o.r,
		n = o.n,
		k = o.k;

	let mainEmail = e[0];

	addline("Hi,");
	addline("");
	addline("I came across your post on Hacker News and wanted to inquire if you were still interviewing for any FT SE roles.");

	// add keywords
	if (k.length > 0) {
		// trim secondary keywords if any for addition later and toggle flag for open source/eth
		for (var i = 0; i < k.length; i++) {
			let keyword = k[i];
			if (checkForOpensourceOrEth(keyword)) {
				k.splice(i, 1);
			}
			if (keyword === 'opensource') addoss = true;
			if (match(k, keth)) addketh = true;
		}

		// Add keyword match sentence
		let kstr = '';
		kstr += "I have experience with ";

		if (k.length > 1) {
			for (var i = 0; i < k.length - 1; i++) {
				kstr += k[i] + ', ';
			}
			kstr += k[k.length - 1];
		} else {
			kstr += k[0];
		}
		kstr += " and noticed them in the post."
		addline(kstr);

		// highlight blockchain exp
		if (addketh || trialRun) {
			addline("I’ve been following blockchain projects like ethereum, dash, ripple, bitcoin etc for a while and have read many whitepapers. I worked on a prototype ethereum ui before mist. More recently I won a prize at Ethwaterloo for prototyping an identity management / social network layer protocol for ethereum. I've also helped organize and run workshops at a ethereum developer meetup and worked on hyperledger projects within IBM. I also recieved a scholarship from the EF to attend Devcon IV this year.");
		}
		if (addoss || trialRun) {
			addline("I'm a big proponent of open source with commits made and merged into 10+ projects including Pythons pip & FBs HHVM PHP compiler")
		}
	}

	// highlight python pip commit
	// if (){}

	// highlight data engineering @ rax w/ go

	addline("You can find my resume <a href='https://kaustavha.github.io/kaustav-haldar-resume/'>here</a> ");
	addline("          LinkedIn: <a href='https://www.linkedin.com/in/khaldar'>khaldar</a> ");
	addline("          Github: <a href='https://github.com/kaustavha'>kaustavha</a> ");
	addline("");
	addline("Please reach out if you think I'd be a good fit for anything you're looking for. ")
	addline("I'm looking for Remote or Canadian positions right now. ")
	// addline("Are you still interviewing candidates?  And do you think I'd be a good fit for this or anything else you're looking for?");
	addline("Looking forward to hearing back from you.");
	addline("");
	addline("Thanks, ");
	addline("Kaustav Haldar ");

	content = "<p style='white-space:pre;display:block;overflow-wrap:normal;'>" + content + "</p>";

	let as = 'tell application "Microsoft Outlook"';
	as += '\nset theContent to "' + content + '"';
	as += '\n   set newMessage to make new outgoing message with properties {subject:"' + defaultsubject + '", content:theContent} ';
	as += '\n   make new to recipient at newMessage with properties {email address: {address:"' + mainEmail + '"}}';
	// as += '\n   make new to recipient at newMessage with properties {email address: {address:"hi@kaustav.me"}}';
	if (e.length > 1) {
		for (var i = 1; i < e.length; i++) {
			as += '\n    make new cc recipient at newMessage with properties {email address: {address:"' + e[i] + '"}}';
		}
	}
	as += '\n   send message id (id of newMessage)';
	as += '\nend tell';

	fcontent += '\n' + as;

	return fcontent;
}

function getHNPosts(pageN) {
	pageN = pageN || 1;
	return new Promise(res => {
		if (!fetchFromHN) return res();
		return _getHNPosts(pageN).then(dat => {
			if (dat == oldDat) {
				if (debug) console.log('got all posts from hn');
				try {
					fs.mkdirSync(yr);
				} catch (e) {}
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
			commtext = stripChildComments(dat);
			$.each( commtext, function( key, value ) {
				buf += htmlDecodeWithLineBreaks($(value).html());
			});
			res(buf)
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
				if (ctext) {
					try {
						ctext.prepend('ago [-]');
						ctext.append('\n\n');
						res.push(ctext);
					} catch (e) {
						// bye
					}
				}
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
				})
		
			});
		})
}

// pollyfill
function htmlDecodeWithLineBreaks(html) {
	var breakToken = '_______break_______',
		lineBreakedHtml = html.replace(/<br\s?\/?>/gi, breakToken).replace(/<p\.*?>(.*?)<\/p>/gi, breakToken + '$1' + breakToken);
	return $('<div>').html(lineBreakedHtml).text().replace(new RegExp(breakToken, 'g'), '\n');
}