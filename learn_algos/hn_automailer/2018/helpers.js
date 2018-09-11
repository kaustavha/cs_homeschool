
// dedupe an array and also cast everything to lowercase
export function dedupeArr(arr) {
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
		"mongodb", "mysql", "sql", "hadoop", "hive",
		"kafka", "grafana", "zookeeper",
		"chef", "ansible", "travis", "jenkins", "kubernetes",
		"rails", "coffeescript",
		"bootstrap", "nodejs",
		"blockchain", "ethereum", "solidity", "hyperledger",
		"redis", "node", "php", "rails",
		"backend", "web", "mobile", "REST", "cassandra",
		"linux", "nginx", "apache", "open source"
	];

	let keywordsMap = {
		"AWS": ['aws', 'amazon'],
		'docker': ['docker', 'containers'],
		'javascript': ['es6', 'js', 'javascript', 'es7', 'esnext'],
		'react': ['react', 'reactjs', "react-native", 'redux', 'mobex'],
		'angular': ['angular', 'angularjs'],
		'go': ['golang', 'go'],
		'elk': ['kibana', 'logstash', 'elasticsearch']
	}

	let words = txt.match(/[a-z]+/gi),
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


// generate apple script for emails
function genAsAll(obj) {
	let c = '';
	for (ki in obj) {
		c += genAS(obj[ki]);
		c += genRandDelay();
	}
	return c;
}

// returns a random delay in apple script betw 5-10mins
function genRandDelay() {
	function getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
	};
    let oneMin = 60,
        fv = 5*oneMin,
        tn = 10*oneMin,
        val = getRandomInt(fv,tn);
	return `\n delay ${val} \n`;
}

