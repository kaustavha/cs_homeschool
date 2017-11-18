const { WebCrawler } = require('../webcrawler');
const { VerboseCrawlerLogger } = require('../loggers');
const assert = require('assert');

function challenge_2_tests() {
    describe('Challenge 2 tests', () => {
        const crawler = new WebCrawler(5, VerboseCrawlerLogger);

        it('challenge 2 should pass', function(done) {
            this.timeout(60000);

            crawler.crawl('triplebyte.github.io/web-crawler-test-site/test2', graph => {
                const url = 'http://triplebyte.github.io/web-crawler-test-site/test2/page2.html';

                assert(Object.keys(graph.nodes).indexOf(url) !== -1);

                done();
            });
        });
    });
}

challenge_2_tests();
