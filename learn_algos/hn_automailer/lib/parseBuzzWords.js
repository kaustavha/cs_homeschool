const { dedupeArr, matchArrs } = require('./utils');

module.exports = function parseBuzzwords(txt) {
    let keth = "blockchain ethereum hyperledger solidity truffle".match(/[a-z]+/gi); // returns an array of keywords

    let keywords = [
        "python", "ruby", "java", "scala", "c++", "lua", "bash", "shell", "scripting", "c#",
        "mongo", "mongodb", "mysql", "sql", "hadoop", "hive",
        "kafka", "sidekiq",
        "grafana", "datadog",
        "zookeeper", "terraform",
        "chef", "ansible", "travis", "jenkins", "kubernetes",
        "rails", "coffeescript",
        "bootstrap", "nodejs",
        "blockchain", "ethereum", "solidity", "hyperledger", "defi",
        "redis", "node", "php", "rails",
        "backend", "web", "mobile", "REST", "cassandra", "frontend", "fullstack",
        "linux", "nginx", "apache", "open source",
        "databricks", "jupyter", "airflow", "mlflow", "tensorflow", "fast.ai", "spark"
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
        'devops': ['devops', 'chef', 'ansible', 'travis', 'jenkins', 'kubernetes', 'docker', 'terraform', 'kubernetes', 'circleci', 'circle-ci']
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

    if (matchArrs(out, keth)) out.push('blockchain')


    return dedupeArr(out);
}
