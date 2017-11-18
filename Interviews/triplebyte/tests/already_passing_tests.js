const { WebCrawler } = require('../webcrawler');
const { clean_up_href, absolutize_path, get_url_strings_from_doc } = require('../html_helper');
const { SilentCrawlerLogger } = require('../loggers');
const assert = require('assert');

function html_helper_tests() {
    describe('html_helper', () => {
        describe('clean_up_href', () => {
            it('should escape space characters', () => {
                assert.equal(clean_up_href("http://www.example.com/space url"),
                             'http://www.example.com/space%20url');
            });
        });

        describe('absolutize_path', () => {
            const base_path = '/base/path/';

            it('should handle base path with trailing slash', () => {
                assert.equal(absolutize_path("/hello", base_path), "/hello");
                assert.equal(absolutize_path("hello/what", base_path), base_path + "hello/what");
                assert.equal(absolutize_path("./hello/what", base_path), base_path + "hello/what");
                assert.equal(absolutize_path("../hello/what", base_path), "/base/hello/what");
                assert.equal(absolutize_path("../../hello/what", base_path), "/hello/what");
            });

            const other_base_path = "/base/path";

            it('should handle base path without trailing slash', () => {
                assert.equal(absolutize_path("/hello", other_base_path), "/hello");
                assert.equal(absolutize_path("hello/what", other_base_path), "/base/hello/what");
                assert.equal(absolutize_path("./hello/what", other_base_path), "/base/hello/what");
                assert.equal(absolutize_path("../hello/what", other_base_path), "/hello/what");
            });
        });

        describe('get_url_strings_from_doc', () => {
            const test_case_html = ('  <!DOCTYPE html>'
                                    + '<html>'
                                    + '  <body>'
                                    + '    <h1>Test Case 1</h1>'
                                    + '    <p>I am a paragraph! <a href="javascript:doThing">blah</a></p>'
                                    + '    <p>Sometimes I am <a href="./cynical.html">overly cynical</a>, but sometimes I am'
                                    + '      <a href="./page2.html">overly na&#xEFve.</a></p>'
                                    + '  </body>'
                                    + '</html>');
            const result = get_url_strings_from_doc(test_case_html);
            const expected = ['javascript:doThing', './cynical.html', './page2.html'];

            it('should extract three results in the test HTML', () => {
                assert.equal(result[0], expected[0]);
                assert.equal(result[1], expected[1]);
                assert.equal(result[2], expected[2]);
            });
        });
    });
}

function crawler_tests() {
    describe('test crawl triplebyte.github.io', () => {
        const crawler = new WebCrawler(100, SilentCrawlerLogger);

        it('passes', function(done) {
            this.timeout(10000);

            var prefix = "http://triplebyte.github.io/web-crawler-test-site/already-passing-tests/";
            crawler.crawl(prefix, graph => {
                assert.notEqual(-1, Object.keys(graph.nodes).indexOf(prefix));
                assert.notEqual(-1, Object.keys(graph.nodes).indexOf(prefix + "page2"));
                assert.notEqual(-1, Object.keys(graph.nodes).indexOf(prefix + "page2-real"));
                assert.notEqual(-1, Object.keys(graph.nodes).indexOf(prefix + "page2-fake"));

                done();
            });
        });
    });
}

html_helper_tests();
crawler_tests();
