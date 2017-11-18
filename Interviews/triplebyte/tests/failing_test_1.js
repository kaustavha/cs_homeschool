const { WebCrawler } = require('../webcrawler');
const { VerboseCrawlerLogger } = require('../loggers');
const assert = require('assert');

function challenge_1_tests() {
    describe('Challenge 1 tests', () => {
        const crawler = new WebCrawler(5, VerboseCrawlerLogger);

        it('challenge 1 should pass', function(done) {
            this.timeout(60000);

            crawler.crawl('triplebyte.github.io/web-crawler-test-site/test1', graph => {
                const url = 'http://triplebyte.github.io/web-crawler-test-site/test1/SVG_logo.svg';
                assert.equal(graph.nodes[url].request_type, 'head');

                done();
            });
        });
    });
}

challenge_1_tests();
