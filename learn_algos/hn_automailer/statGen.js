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
	'21126014'
]
let genStatsOverYear = () => {
	for (let i=0; i<postUrlIds.length; i++) {
        let hnurlid = postUrlIds[i];
        console.log("current month: " + i);
		console.log('current hn url id: ', hnurlid);
		let child = execSync('node main.js '+hnurlid , { encoding : 'utf8' });
		console.log(child);
	}
}
genStatsOverYear();
