const { WebCrawler } = require('../webcrawler');
const { VerboseCrawlerLogger } = require('../loggers');
const assert = require('assert');

function challenge_4_tests() {
    describe('Challenge 4 tests', () => {
        const crawler = new WebCrawler(5, VerboseCrawlerLogger);

        it('challenge 4 should pass', function(done) {
            this.timeout(60000);

            crawler.crawl('triplebyte.github.io/web-crawler-test-site/test4', graph => {
                const url = 'https://triplebyte.github.io/web-crawler-test-site/test4/page3';
                assert(Object.keys(graph.nodes).indexOf(url) !== -1);

                done();
            });
        });
    });
}

challenge_4_tests();
