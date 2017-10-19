class Node {

}

class Graph {
	constructor() {
		this.graph = {};
	}

	addEdge(u,v) {
		if (!this.graph[u]) this.graph[u] = [];
		this.graph[u].push(v);
	}

	BFS(s) {
		let visited = {},
			queue = [];
		queue.push(s);
		visited[s] = true;
		while (queue.length > 0) {
			s = queue.shift();
			console.log(s);

			for (let i in this.graph) {
				if (!visited[i]) {
					queue.push(i);
					visited[i] = true;
				}
			}
		}

	}
}

let g = new Graph();
g.addEdge(0, 1)
g.addEdge(0, 2)
g.addEdge(1, 2)
g.addEdge(2, 0)
g.addEdge(2, 3)
g.addEdge(3, 3)
g.BFS(2);