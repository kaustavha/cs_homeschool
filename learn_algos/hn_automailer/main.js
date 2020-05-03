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

 /**
  * Quickstart:
  * ```
  * npm i
  * node main.js
  * 
  * # or
  * 
  * node main.js <hn job url num> <month>
  * ```
*/

// Used by statgen - cli flags
let argHnUrlId, genStats, curMonth;
const myArgs = process.argv.slice(2);
if (myArgs.length > 0) {
	// 1st arg is hnurl id
	argHnUrlId = myArgs[0];
	genStats = myArgs[0] ? true : false;
	curMonth = myArgs[1] ? myArgs[1] : false;
}

// manual inputs and flags that affect each run
const hnurlid = argHnUrlId ? argHnUrlId : '21419536'; // e.g. https://news.ycombinator.com/item?id=18499843 i.e https://news.ycombinator.com/item?id=${hnurlid}
const debug = false; // output console logs at different steps
const remoteOnly = false; // only pull in remote jobs + foll. flags
const torontoAndRemoteOnly = false; // strict mode
const includeCanada = true; // needs the above flag to be true, also adds in jobs in canada
const includeusa = true; // same as above but city keywords for the states
const fetchFromHN = true; // Run a fresh fetch from HN, otherwise we expect a file to exist from an old run
const keywordMatchOnly = false; // Only write applescript emails for jobs where we have keyword matches

// Dependencies
const fs = require('fs');

const { getAppleScriptGenerator, getApplescriptSeriesGenerator } = require('./lib/generate_applescript');
const getEmailParser = require('./lib/parseEmailFromBlock');
const isBLCo = require('./lib/isBreakoutList');
const parseBuzzwords = require('./lib/parseBuzzWords');
const { getIsRemoteParser, grabSalary } = require('./lib/utils')
const Scraper = require('./lib/scraper');
const getStatGenerator = require('./lib/getStats');


// Dates for creating filenames
const date = new Date(),
	month = curMonth ? curMonth : date.getMonth() + 1,
	yr = date.getFullYear();


// FS names
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
	remoteJobsRejectsFs = jobsList + '_remotes_rejects.txt',
	breakoutListFs = jobsList + '_breakoutList.txt';


// Delay min max for applescript
let oneMin = 60,
	fvmin = oneMin * 5,
	tenMin = oneMin * 10,
	minDelay = oneMin,
	maxDelay = fvmin;


// data stores for outputs
let blocks = [],
	emails = [],
	allroles = [],
	salaries = [],
	remoteJobs = [],
	rejects = [],
	remoteJobsRejects = [],
	breakoutlist = [];

// block level vars used when parsing job descr blocks
let block = false,
	blockbuf = '',
	roles = [],
	postername,
	matcheskeywords = 0;

const { scraper, parseEmailFromBlock, genAS, genAsAll, isRemote, stats, setStats } = setup();
start();


function start() {
	if (fetchFromHN) {
		scraper.getAllHNPosts(1).then(x => main());
	} else {
		main();
	}
}

function main() {
	populateBlocks();
	let asc = genAsAll(blocks);
	console.log('emails ', emails.length);
	console.log('rejects ', rejects.length);
	console.log('keyword matches ', matcheskeywords);
	console.log('remote ', remoteJobs.length);
	console.log('remote rejects', remoteJobsRejects.length);
	console.log('breakout list companies', breakoutlist.length);
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
	fs.writeFileSync(breakoutListFs, breakoutlist);

	if (genStats) {
		console.log(stats)
	}

	console.log("Done");
	return Promise.resolve();
}
//========================================= End
// Functions

function setup() {
	// sanity directory check
	try {
		fs.mkdirSync('./' + yr);
	} catch (e) { }

	// try to grab a list of successfully parsed/sent emails so we dont email people twice
	let sentEmails;
	if (fs.existsSync(sentEmailsfs)) {
		sentEmails = fs.readFileSync(sentEmailsfs, 'utf8').split('\n');
	} else {
		sentEmails = [];
	}

	const { stats, setStats } = getStatGenerator();

	const genAS = getAppleScriptGenerator({
		month: month,
		yr: yr
	});


	return {
		scraper: new Scraper({
			debug: debug,
			jobsListfs: jobsListfs,
			fetchFromHN: fetchFromHN,
			hnurlid: hnurlid
		}),
		parseEmailFromBlock: getEmailParser({
			debug: debug,
			emails: emails,
			sentEmails: sentEmails
		}),
		genAsAll: getApplescriptSeriesGenerator({
			genAS: genAS,
			minDelay: minDelay,
			maxDelay: maxDelay
		}),
		isRemote: getIsRemoteParser({
			torontoAndRemoteOnly: torontoAndRemoteOnly,
			includeCanada: includeCanada,
			includeusa: includeusa,
			debug: debug
		}),
		genAS: genAS,
		stats: stats,
		setStats: setStats
	}
}

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
					setStats(keywords)
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
					let itIsBLCo = isBLCo(blockbuf);
					let blockStats = blockbuf.concat(
						'\n',
						blockbuf.length ? ` | len: ${blockbuf.length} | ` : '| empty block |',
						keywords.length > 0 ? keywords : 'no keyword match',
						(isRemote(blockbuf) === false ? ' remote: false ' : ' remote: true '),
						etxt && etxt.length > 0 ? etxt : 'no email',
						itIsBLCo ? ' | Breakoutlist company!! ' + itIsBLCo : ' | Not blco ',
						'\n'
					);
					rejects.push(blockStats);

					// grab and prioritize remote jobs we missed for manual
					if (isRemote(blockbuf) !== false
						&& ((!etxt || etxt.length === 0 || etxt[0] == 'null') && etxt[0] !== 'blacklist')
						&& (keywordMatchOnly ? keywords.length > 0 : true)) {
						remoteJobsRejects.push(blockStats);
					}
					if (itIsBLCo && (etxt.length === 0 || etxt[0] !== 'blacklist')) {
						breakoutlist.push(blockStats);
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
