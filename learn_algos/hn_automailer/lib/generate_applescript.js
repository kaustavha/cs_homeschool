
const {genRandDelay} = require('./utils');

function getAppleScriptGenerator({ month, yr, stats }) {

	// Amazon, Apple, Evernote, Facebook, Google, LinkedIn, Microsoft, Oracle, any Y Combinator startup, Yelp, and Zynga.
	function genAS(obj, trialRun) {
		let o = obj,
			e = o.e,
			txt = o.txt,
			r = o.r,
			n = o.n,
			k = o.k;

		let content = '';
		// Utils for generating applescript
		function addline(txt) {
			content += txt + "\n";
		}

		function addKeyWords() {
			let krax = "Go, golang, Lua, JS, Python, Ruby, Java, C++, Bash;  Hadoop, Hive, Kafka, MongoDB, ElasticSearch, Logstash, Kibana, Grafana, Docker, Chef, Travis, Jenkins, Ansible zookeeper".
				match(/[a-z]+/gi),
				kspark = "MongoDB/NoSQL, ExpressJS, AngularJS, NodeJS, Nginx, AWS, javascript".match(/[a-z]+/gi),
				python = ["pip", "python", "anaconda"],
				keth = "blockchain ethereum hyperledger solidity truffle".match(/[a-z]+/gi), // returns an array of keywords
				addketh = false,
				addoss = false;
			const checkForOpensourceOrEth = (keyword) => keyword === 'opensource' || keth.indexOf(keyword) > -1;

			// add keywords
			if (k.length > 0) {
				// trim secondary keywords if any for addition later and toggle flag for open source/eth
				for (var i = 0; i < k.length; i++) {
					let keyword = k[i];
					if (checkForOpensourceOrEth(keyword)) {
						// k.splice(i, 1);
					}
					if (keyword === 'opensource') addoss = true;
					if (match(k, keth)) addketh = true;
				}

				// Add keyword match sentence
				let kstr = '';
				kstr += "I have previous experience with ";

				if (k.length > 1) {
					for (var i = 0; i < k.length - 1; i++) {
						kstr += k[i] + ', ';
					}
					kstr += k[k.length - 1];
				} else {
					kstr += k[0];
				}
				kstr += " and saw them in your post."
				addline(kstr)

				// highlight blockchain exp
				if (addketh || trialRun) {
					stats.eth = stats.eth ? stats.eth + 1 : 1;
					addline(' ')
					addline("I've been in the blockchain space since 2013 and received a full scholarship to attend Devcon in 2018 from the Ethereum Foundation. ")
					addline("I've also helped organize and run workshops at ethereum developer meetups at UWaterloo and worked on hyperledger projects and patents within IBM. ");
				}
				if (addoss || trialRun) {
					addline(' ')
					addline("I'm a big proponent of open source with commits merged into 10+ projects including Pythons pip & FBs HHVM PHP compiler")
				}
			}
		}
		// End
		addline("Hi,");
		addline("");
		addline("I saw your post on HN Who's Hiring. Are you still interviewing for any full time software engineering or related roles?  ");
		addline("I'm a generalist software engineer with 6 years of experience overall. Including startups and large enterprise companies. ")

		addKeyWords();

		// highlight python pip commit
		// if (){}

		// Using long urls becos of applemail
		addline("")
		addline("You can find my resume at http://cv.kaustav.me or via my website: http://kaustav.me");
		addline("LinkedIn: khaldar | https://www.linkedin.com/in/khaldar");
		addline("Github: kaustavha | https://github.com/kaustavha");

		// addline("You can find my resume <a href='https://kaustavha.github.io/kaustav-haldar-resume/'>here</a> ");
		// addline("          LinkedIn: <a href='https://www.linkedin.com/in/khaldar'>khaldar</a> ");
		// addline("          Github: <a href='https://github.com/kaustavha'>kaustavha</a> ");
		addline("");
		addline("I'm currently based out of Toronto, Canada. But open to relocation or remote. ")
		addline("Do you think I'd be a good fit for any open roles you have? ");
		addline("");
		addline("Thank you, ");
		addline("Kaustav Haldar ");

		return genMailAS({
			content: content,
			defaultsubject: "SE opportunities" + `[HN Who's Hiring ${month}/${yr}]`,
			defaultSender: 'kaustav haldar <hi@kaustav.me>',
			mainEmail: e[0]
		});
	}

	function genMailAS({ content, defaultsubject, defaultSender, mainEmail }) {
		let as = 'tell application "Mail"';
		// as += '\n	set theContent to "' + content + '"';
		as += '\n	set newMessage to make new outgoing message with properties {visible:true} ';

		// message opts
		as += '\n	tell newMessage';
		as += `\n		make new to recipient at newMessage with properties {address:"${mainEmail}"}`;
		as += `\n		set content to "${content}"`;
		as += `\n		set subject to "${defaultsubject}"`;
		as += `\n		set sender to "${defaultSender}"`;
		// as += '\n   make new to recipient at newMessage with properties {email address: {address:"hi@kaustav.me"}}';

		// ignore extra emails for now

		// if (extraEmails.length > 1) {
		// 	for (var i = 1; i < extraEmails.length; i++) {
		// 		as += '\n		make new cc recipient at newMessage with properties {address:"' + extraEmails[i] + '"}';
		// 	}
		// }
		as += '\n	end tell'
		as += '\n	send newMessage';
		as += '\nend tell';

		return '\n' + as;
	}

	function match(a1, a2) {
		for (var i = 0; i < a1.length; i++) {
			if (a2.indexOf(a1[i]) > -1) return true;
		}
		return false;
	}

	// old function - need to repair 
	// content is generated by addLine func in genAS
	function genOutlookAS(content, defaultsubject, mainEmail, extraEmails) {
		let fcontent = '';
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

	return genAS;
}


// generate applescript 
// utitlity helper function to loop through objects
// and generate applescript using supplied configured Apple script generator func
// and add a random delay between each AS obj
function genAsAll(obj, genAS, minDelay, maxDelay) {
	let c = '';
	for (let ki in obj) {
		c += genAS(obj[ki]);
		c += genRandDelay(minDelay, maxDelay);
	}
	return c;
}

function getApplescriptSeriesGenerator({genAS, minDelay, maxDelay}) {
    return (obj) => genAsAll(obj, genAS, minDelay, maxDelay)
}

module.exports = {
	getAppleScriptGenerator: getAppleScriptGenerator,
	getApplescriptSeriesGenerator: getApplescriptSeriesGenerator
};
