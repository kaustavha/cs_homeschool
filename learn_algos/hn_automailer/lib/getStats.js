module.exports = function getStatGenerator() {
    let stats = {
        py: 0,
        js: 0,
        ruby: 0,
        go: 0,
        java: 0,
        eth: 0
    }
    function setStats(keywords) {
        if (keywords.indexOf('python') > -1) stats.py++;
        if (keywords.indexOf('javascript') > -1) stats.js++;
        if (keywords.indexOf('ruby') > -1) stats.ruby++;
        if (keywords.indexOf('go') > -1) stats.go++;
        if (keywords.indexOf('blockchain') > -1) stats.eth++;
        if (keywords.indexOf('java') > -1) stats.java++;
    }
    return {
        stats: stats,
        setStats: setStats
    }
}
