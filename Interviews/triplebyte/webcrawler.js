const url_lib = require('url');
const http = require('follow-redirects').http;

// html_helper.js contains the logic for parsing HTML and getting useful URLs
// from it
const html_helper = require('./html_helper');

// graph.js contains the class which represents the website graph, with nodes
// and edges.
const graph = require('./graph');

// loggers.js defines different Logger objects, which are used to control
// logging behaviors
const loggers = require('./loggers');

function WebCrawler(max_tasks, logger_class) {
    this._number_of_running_tasks = 0;
    this.max_tasks = max_tasks;
    this.queue = [];
    this.currently_being_explored = new Set();
    this.graph = new graph.WebsiteGraph();
    this.errors = [];

    if (logger_class) {
        this.logger = new logger_class();
    } else {
        this.logger = new loggers.SilentCrawlerLogger();
    }
};

WebCrawler.prototype.crawl = function(initial_url, callback) {
    if (!initial_url.startsWith('http')) {
        initial_url = 'http://' + initial_url;
    }

    console.log("url. "+initial_url);

    let parsed_initial_url = url_lib.parse(initial_url);
    parsed_initial_url.path = '';
    parsed_initial_url.query = '';
    parsed_initial_url.hash = '';
    this.domain = url_lib.format(parsed_initial_url);

    this._enqueue(initial_url);

    const checkIfDone = () => {
        if (this.queue.length === 0 && this.currently_being_explored.size === 0) {
            console.log('Done!');

            if (!this.errors) {
                console.log('No errors found!');
            } else {
                console.log('Here are all the complaints found:');
                this.errors.forEach(error => {
                    console.log(error);
                });
            }

            callback(this.graph);
        } else {
            setTimeout(checkIfDone, 1000);
        }
    };
    checkIfDone();
};

WebCrawler.prototype._enqueue = function(url) {
    if (Object.keys(this.graph.nodes).indexOf(url) !== -1) {
        return;
    }

    this.graph.add_node(url);
    this.logger.enqueue(url);

    if (this._number_of_running_tasks < this.max_tasks) {
        this._number_of_running_tasks += 1;
        this._spawn_crawling_task(url);
    } else {
        this.queue.push(url);
    }
};

WebCrawler.prototype._spawn_crawling_task = function(url) {
    this.logger.spawn_crawling_task(url);
    this.currently_being_explored.add(url);

    if (this.url_should_be_crawled_as_node(url)) {
        this._crawl_with_get_request(url);
    } else {
        this._crawl_with_head_request(url);
    }
};

WebCrawler.prototype._finalize_crawl = function(url) {
    this.logger.finalize_crawl(url);
    this.currently_being_explored.delete(url);

    if (this.queue.length > 0) {
        url = this.queue.pop();
        this._spawn_crawling_task(url);
    } else {
        this._number_of_running_tasks -= 1;
    }
};

WebCrawler.prototype.url_should_be_crawled_as_node = function(url) {
    const parsed_url = url_lib.parse(url);
    const parsed_domain = url_lib.parse(this.domain);

    if (parsed_url.host !== parsed_domain.host) {
        return false;
    }

    // prevent you from starting to crawl FTP if you're looking at HTTP
    if (parsed_url.protocol !== parsed_domain.protocol) {
        return false;
    }

    const filetype_list = ['pdf', 'jpg', 'gif', 'js', 'css', 'png', 'svg'];

    const split_url = url.split('.');
    if (filetype_list.indexOf(split_url[split_url.length - 1]) !== -1) {
        return false;
    }

    return true;
};

WebCrawler.prototype._crawl_with_get_request = function(url) {
    this.logger.crawl_with_get_request(url);

    let node = this.graph.nodes[url];
    node.request_type = 'get';

    const parsed_url = url_lib.parse(url);
    let response_data = '';
    const request = http.request({
        host: parsed_url.hostname,
        path: parsed_url.path,
        port: parsed_url.port
    }, response => {
        response.on('data', chunk => {
            response_data += chunk;
        });

        response.on('end', () => {
            if (response_data && response.headers['content-type'].split('/')[0] === 'text') {
                let res_url = url;
                let split_url = url.split('/');
                if (split_url[split_url.length - 1].indexOf('.') === -1) {
                    res_url += '/';
                }

                let { out, errors } = html_helper.get_neighbors(response_data, res_url);
                let neighbors = out;

                this.errors = this.errors.concat(errors);

                neighbors.forEach(neighbor_url => {
                    this.graph.add_neighbor(url, neighbor_url);
                    this._enqueue(neighbor_url);
                });
            }

            let data = { 'request_type' : 'get',
                         'status' : response.statusCode };

            if (response.statusCode === 301) {
                data.headers = response.headers;
            }

            node.status = 'success';
            node.status_code = response.statusCode;
            node.contents = response_data;

            this._finalize_crawl(url);
        });
    });

    request.on('error', e => {
        node.status = 'failure';
        node.error = e;
        this._finalize_crawl(url);
    });

    request.on('socket', socket => {
        socket.setTimeout(1000);
        socket.on('timeout', () => {
            request.abort();
        });
    });

    request.end();
};

WebCrawler.prototype._crawl_with_head_request = function(url) {
    this.logger.crawl_with_head_request(url);

    let node = this.graph.nodes[url];
    node.request_type = 'head';

    const parsed_url = url_lib.parse(url);
    let response_data = '';
    const request = http.request({
        method: 'HEAD',
        host: parsed_url.hostname,
        path: parsed_url.path,
        port: parsed_url.port
    }, response => {
        response.on('data', chunk => {
            response_data += chunk;
        });

        response.on('end', () => {
            node.status = 'success';
            node.status_code = response.statusCode;
            this._finalize_crawl(url);
        });
    });

    request.on('error', e => {
        node.status = 'failure';
        node.error = e;
        this.note_error(`When crawling ${url}, got a ${e} (linked from ${this.graph.parents(url)}`);
        this._finalize_crawl(url);
    });

    request.on('socket', socket => {
        socket.setTimeout(1000);
        socket.on('timeout', () => {
            request.abort();
        });
    });

    request.end();
};

WebCrawler.prototype.note_error = function(error) {
    this.errors.push(error);
    this.logger.note_error(error);
};

module.exports.WebCrawler = WebCrawler;
