// file names

const jobsListfs = './2018/jobs.txt',
	sentEmailsfs = './emailsbackup_alreadysent.txt',
	outputApplScriptfs = './2018/final.scpt',
	tstAs = outputApplScriptfs + 'test',
	rejectsfs = './2018/rejects.txt',
	rawEmailListfs = './2018/emails.txt';

const fs = require('fs');
let txt = fs.readFileSync(jobsListfs);
txt += '';
let lines = txt.split('\n');
txt = txt.split('\n');

let blocks = [],
	emails = [],
	allroles = [],
	salaries = [];

let sentEmails = fs.readFileSync(sentEmailsfs) + '';
sentEmails = sentEmails.split('\n');

// block level
let block = false,
	blockbuf = '',
	roles = [],
	matchingKeywords = [],
	postername;

let rejects = [];

// push first test block
// console.log(lines.length);


for (var i = 0; i < lines.length; i++) {
	let tl = lines[i];
	if (tl.indexOf('ago [-]') > -1 || i == lines.length - 1) {

		if (!block) {
			block = true;
		} else {
			// new block
			let etxt = parseEmailFromBlock(blockbuf),
				keywords = parseBuzzwords(blockbuf);
			// salaries.push(grabSalary(blockbuf));

			if (etxt[0] == 'null') console.log(blockbuf);
			if (etxt.length > 0 && etxt[0] != 'null') {
				emails.push(etxt + ' ' + grabSalary(blockbuf));
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
// console.log(i);
// console.log(rejects);
// console.log(emails);
// console.log(emails);
let asc = genAsAll(blocks);
// console.log(blocks);
// console.log(dedupeArr(allroles));
// console.log(genAsAll(blocks));
// console.log(lines);
console.log(emails.length);
console.log(rejects.length);

fs.writeFileSync(outputApplScriptfs, asc);
let tb = blocks[0];
tb.e = ["hi@kaustav.me", "kausthal@gmail.com", "hi@kaustav.me"];
fs.writeFileSync(outputApplScriptfs, genAS(tb));
fs.writeFileSync(rejectsfs, rejects.join("\n"));
fs.writeFileSync(rawEmailListfs, emails.join("\n"));


//========================================= End
// Functions

// const grabSalary = (blk) => blk.split('\n').shift().match(/\$*\d+/);

function grabSalary(blk) {
	return blk.split('\n')[2].match(/\$*\d+/);
}

function parseEmailFromBlock(t, iteration) {
	let emailRx = /[a-z0-9\.\@\-\_\+]+/gi;
	let l = t.split('\n'),
		buf = '';
	for (var i = 0; i < l.length; i++) {
		let tl = l[i];
		let words = tl.match(emailRx);

		if (!words) words = [];
		for (var j = 0; j < words.length; j++) {
			let word = words[j],
				tb = '';

			// if (word.match(/advocacy/)) console.log(words.slice(0, j+5));


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
				console.log('at');
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
				console.log('dot', word);
				let start = j - 5 < 0 ? 0 : j - 5,
					end = j + 5 > words.length ? words.length : j + 5;

				tb += words.slice(start, end).join(" ");
			}

			if (tb.length > 0) console.log('1', tb);

			tb = tb.replace(/\s*\[at\]\s*/gi, '@');
			// tb = tb.replace(/\s+at\s+/gi, '@');
			tb = tb.replace(/\s*\[@\]\s*/gi, '@');
			tb = tb.replace(/\s*\(at\)\s*/gi, '@');
			tb = tb.replace(/\s*\<at\>\s*/gi, '@');
			tb = tb.replace(/\s*\{at\}\s*/gi, '@');

			tb = tb.replace(/\s*\(@\)\s*/gi, '@');


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


			if (tb.length > 0) console.log('2', tb);
			buf += " " + tb;

			// if (tb.length > 0) console.log(buf);

		}

		// if (tl.indexOf('email') > -1) {
		// 	//snip snip
		// 	let i = tl.indexOf('email'),
		// 		i2 = i + 150;
		// 	buf += tl.substring(i, i2);
		// 	// buf += tl + l[i+1];
		// 	emails.push(buf);
		// }

	}

	buf = buf.trim();
	let posems = [];
	if (buf.indexOf('@') > -1 && buf.indexOf(".") > -1) {
		let ws = buf.match(emailRx);
		for (var i = 0; i < ws.length; i++) {
			let w = ws[i];
			if (w.indexOf('@') > -1 && w.indexOf(".") > -1) {
				if (w.match(/@/gi).length > 1) {
					w = w.split("@").splice(1, 2).join("@");
					// if (w.match())
					w = w.match(/[a-z]+.*\@[a-z]+/gi) + w.match(/\.[a-z]+/gi);

				}

				if (w.length > 0) console.log('1', w);

				// if (!w.match(/[a-z]+.*\@[a-z]+.*[a-z]+/gi)) console.log(w);
				w = w.match(/[a-z0-9\.\-\_\+]+\@[a-z0-9\-\.]+\.+[a-z0-9]+/gi) + '';
				// if (w.length > 0) console.log(w);
				if (!w.match(/name/) && !w.match(/http/)) posems.push(w);
			}
		}
	}

	if (posems.length == 0) {
		if (!iteration == 1) posems = parseEmailFromBlock(parseLine2(t), 1);
	}
	posems = dedupeArr(posems);
	let out = [];
	if (sentEmails.indexOf(posems.join(",")) == -1) out = posems;
	// do not email peope again************************************8\\
	//IMPORTANT
	// for (var i = 0; i < posems.length; i++) {
	// 	if (sentEmails.indexOf(posems[i] == -1)) out.push(posems[i]); 
	// }


	// if (posems.length > 0) console.log(posems);
	return out;
}

function parseLine2(tb) {
	console.log(tb);

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

	console.log(tb);
	return tb;
}

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
		keth = "blockchain ethereum solidity truffle".match(/[a-z]+/gi);
	let keywords = [
		"AWS",
		"docker",
		"go", "golang",
		"python", "ruby", "java", "c++", "lua", "js", "javascript", "bash", "shell", "scripting",
		"mongodb", "mysql", "sql", "hadoop", "hive",
		"elasticsearch", "logstash", "kibana", "kafka", "grafana", "zookeeper",
		"chef", "ansible", "travis", "jenkins", "kubernetes",
		"angular", "angularjs", "react", "reactjs", "redux", "react-native", "rails", "coffeescript",
		"bootstrap", "nodejs",
		"blockchain", "ethereum", "solidity",
		"redis", "node", "php", "rails",
		"backend", "web", "mobile", "REST", "cassandra",
		"linux", "nginx", "apache", "open source"
	];

	let words = txt.match(/[a-z]+/gi),
		out = [];

	for (var i = 0; i < words.length; i++) {
		let twlc = words[i].toLowerCase();

		if (keywords.indexOf(twlc) != -1) out.push(keywords[keywords.indexOf(twlc)]);
	}
	return dedupeArr(out);
}

function genAsAll(obj) {
	let c = '';
	for (ki in obj) {
		c += genAS(obj[ki]);
		c += '\n delay 5 \n';
	}
	return c;
}


// Amazon, Apple, Evernote, Facebook, Google, LinkedIn, Microsoft, Oracle, any Y Combinator startup, Yelp, and Zynga.
function genAS(obj) {
	let defaultsubject = "HackerNews FT SE opportunities";
	let fcontent = '';

	let krax = "Go, golang, Lua, JS, Python, Ruby, Java, C++, Bash;  Hadoop, Hive, Kafka, MongoDB, ElasticSearch, Logstash, Kibana, Grafana, Docker, Chef, Travis, Jenkins, Ansible zookeeper".
	match(/[a-z]+/gi),
		kspark = "MongoDB/NoSQL, ExpressJS, AngularJS, NodeJS, Nginx, AWS, javascript".match(/[a-z]+/gi),
		python = ["pip", "python", "anaconda"],
		keth = "blockchain ethereum solidity truffle".match(/[a-z]+/gi);

	let content = '';
	let o = obj,
		e = o.e,
		txt = o.txt,
		r = o.r,
		n = o.n,
		k = o.k;

	let mainEmail = e[0];

	function addline(txt) {
		content += txt + "\n";
	}

	addline("Hi,");
	addline("");
	addline("I came across your post on Hacker News and wanted to inquire if you were still interviewing for any FT SE roles.");

	// add keywords
	if (k.length > 0) {
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
		kstr += "  and noticed them in the post."
		addline(kstr);

		// highlight blockchain exp
		if (match(k, keth)) {
			addline("I’ve been following blockchain projects like ethereum, dash, ripple, bitcoin etc for a while and have read many whitepapers. I worked on a prototype ethereum ui before mist. More recently I won at a hackathon nearby, Ethwaterloo for prototyping an identity management / social network layer protocol for ethereum.");
		}
	}

	function match(a1, a2) {
		for (var i = 0; i < a1.length; i++) {
			if (a2.indexOf(a1[i]) > -1) return true;
		}
		return false;
	}

	// highlight python pip commit
	// if (){}

	// highlight data engineering @ rax w/ go

	addline("Here's my resume: <a href='http://kaustavha.github.io/kaustav-haldar-resume/'>bit.ly/khaldarcv</a> ");
	addline("          LinkedIn: <a href='https://www.linkedin.com/in/khaldar'>khaldar</a> ");
	addline("          Github: <a href='https://github.com/kaustavha'>kaustavha</a> ");
	addline("");
	addline("Are you still interviewing candidates?  And do you think I'd be a good fit for this or anything else you're looking for?");
	addline("Looking forward to hearing back from you.");
	addline("");
	addline("Thanks, ");
	addline("Kaustav Haldar ");

	content = "<p style='white-space:pre;display:block;overflow-wrap:normal;'>" + content + "</p>";

	let as = 'tell application "Microsoft Outlook"';
	as += '\n set theContent to "' + content + '"';
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
