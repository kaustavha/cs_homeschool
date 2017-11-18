
function WebsiteGraph() {
    this.nodes = {};
    this.outgoing_links = {};
    this.incoming_links = {};
}

WebsiteGraph.prototype.add_node = function(url) {
    this.nodes[url] = new PageNode(url);
};

WebsiteGraph.prototype.add_neighbor = function(from_url, to_url) {
    if (Object.keys(this.outgoing_links).indexOf(from_url) === -1){
        this.outgoing_links[from_url] = [];
    }

    if (Object.keys(this.incoming_links).indexOf(to_url) === -1){
        this.incoming_links[to_url] = [];
    }

    this.outgoing_links[from_url].push(to_url);
    this.incoming_links[to_url].push(from_url);
};

WebsiteGraph.prototype.parents = function(url) {
    return this.incoming_links[url] || [];
};

function PageNode(url) {
    this.url = url;
    this.request_type = null;
    this.status = null;
    this.status_code = null;
    this.contents = null;
    this.error = null;
}

module.exports.WebsiteGraph = WebsiteGraph;
