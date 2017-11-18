
function SilentCrawlerLogger() {}
SilentCrawlerLogger.prototype.enqueue = function(self, url) {};
SilentCrawlerLogger.prototype.finalize_crawl = function(self, url) {};
SilentCrawlerLogger.prototype.spawn_crawling_task = function(self, url) {};
SilentCrawlerLogger.prototype.crawl_with_head_request = function(self, url) {};
SilentCrawlerLogger.prototype.crawl_with_get_request = function(self, url) {};
SilentCrawlerLogger.prototype.note_error = function(self, error) {};

function VerboseCrawlerLogger(url) {}
VerboseCrawlerLogger.prototype.enqueue = function(url) {
    console.log(`url enqueued: ${url}`);
};

VerboseCrawlerLogger.prototype.finalize_crawl = function(url) {
    console.log(`finalize crawl: ${url}`);
};

VerboseCrawlerLogger.prototype.spawn_crawling_task = function(url) {
    console.log(`spawning a crawler to look at ${url}`);
};

VerboseCrawlerLogger.prototype.crawl_with_head_request = function(url) {
    console.log(`crawling with HEAD request: ${url}`);
};

VerboseCrawlerLogger.prototype.crawl_with_get_request = function(url) {
    console.log(`crawling with GET request: ${url}`);
};

VerboseCrawlerLogger.prototype.note_error = function(error) {
    console.log(`error! ${error}`);
};

module.exports.SilentCrawlerLogger = SilentCrawlerLogger;
module.exports.VerboseCrawlerLogger = VerboseCrawlerLogger;
