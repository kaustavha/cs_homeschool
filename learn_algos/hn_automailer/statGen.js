const { execSync } = require('child_process');

let postUrlIds = [
	'18807017',
	'19055166',
	'19281834',
	'19543940',
	'19797594',
	'20083795',
	'20325925',
	'20584311',
	'20867123',
	'21126014',
	'21419536'
]
let genStatsOverYear = () => {
	for (let i = 0; i < postUrlIds.length; i++) {
		let hnurlid = postUrlIds[i];
		let curMonth = i + 1;
		console.log("current month: " + curMonth);
		console.log('current hn url id: ', hnurlid);
		let child = execSync(`node main.js ${hnurlid} ${curMonth}`, { encoding: 'utf8' });
		console.log(child);
	}
}
genStatsOverYear();
