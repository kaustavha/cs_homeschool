const { WebCrawler } = require('../webcrawler');
const { VerboseCrawlerLogger } = require('../loggers');
const assert = require('assert');

function challenge_3_tests() {
    describe('Challenge 3 tests', () => {
        const crawler = new WebCrawler(5, VerboseCrawlerLogger);

        // The bug here is that the crawler will hang. Don't sit around waiting
        // for it to finish!

        it('challenge 3 should pass', function(done) {
            this.timeout(60000);

            crawler.crawl('triplebyte.github.io/web-crawler-test-site/test3', graph => {
                assert.notEqual(-1, Object.keys(graph.nodes).indexOf('http://blah.com:7091/'));

                done();
            });
        });
    });
}

challenge_3_tests();
