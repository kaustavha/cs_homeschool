const {dedupeArr} = require('./utils');

module.exports = function parseBuzzwords(txt) {
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
	
	if (!words) return out;

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