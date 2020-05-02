class Node {
	constructor(val, connections) {
		this.val = val;
		this.connections = connections;
		this.lowTime;
		this.high;
		this.onStack = false;
		this.index = false;
	}
}

class Graph {
	constructor() {
		this.graph = {};
	}

	findArticulationPointsBruteForce(set) {
		// Brute force method of articulation pt finding
		// For each vertex in graph, remove it, see if all other vertices can still be reached
		// O(V(v+E))
		set ? this.constructAdjListFromSet_undirected(set) : null;

		const checkIfAllVisitable = (visitable=[], graph, startNode, visited) => {
			if (visited.length === visitable.length) return true;
			let allVisited = false;
			graph[startNode].some(vertex => {
				if (visitable.indexOf(vertex) > -1 && visited.indexOf(vertex) === -1) {
					visited.push(vertex);

					// call recursion with shared visited object
					if (checkIfAllVisitable(visitable, graph, vertex, visited)) {
						allVisited = true;
						return;
					}
				}
			});
			return allVisited;
		}

		let articulationPoints = [];

		Object.keys(this.graph).forEach(vertex => {
			let newGraph = {};
			Object.assign(newGraph, this.graph);
			delete newGraph[vertex];
			let visitable = Object.keys(newGraph).map(x => parseInt(x));
			let res = checkIfAllVisitable(visitable, newGraph, visitable[0], [visitable[0]]);
			if (!res) articulationPoints.push(vertex);
		})

		return articulationPoints;
	}

	

	findArticulationPoints(set) {
		let time = 0;

		set ? this.constructAdjListFromSet_undirected(set) : null;
		// this.constructGraphForTarjans();
		// console.log(this.graph)

		const APUtil = (vertex, visited=[], articulationPoints=[], parents=[], discoveryTimes=[], lowTimes=[]) => {
			let children = 0;
			visited.push(vertex);

			discoveryTimes[vertex] = time;
			lowTimes[vertex] = time;
			time++;

            // If v is not visited yet, then make it a child of u 
            // in DFS tree and recur for it 
			this.graph[vertex].forEach(curVertex => {
				if (visited.indexOf(curVertex) === -1) {
					parents[curVertex] = vertex;
					children++;
					APUtil(curVertex, visited, articulationPoints, parents, discoveryTimes, lowTimes)

					// Check if the subtree rooted with vertex has a connection to 
					// one of the ancestors of curVertex
					lowTimes[vertex] = Math.min(lowTimes[curVertex], lowTimes[vertex])

					// curVertex is an articulation pt in following cases:
					// 1: vertex is root of DFS tree && >=2 children
					if (parents.indexOf(vertex) === -1 && children >= 2) {
						articulationPoints[vertex] = true;
					}

					// 2: if vertex is not root and low val of one of its child is more than dicovery time of vertex i.e no backedge
					if (parents.indexOf(vertex) !== -1 && lowTimes[curVertex] >= discoveryTimes[vertex]) {
						articulationPoints[vertex] = true;
					}
				} else if (curVertex != parents[vertex]) {
					lowTimes[vertex] = Math.min(lowTimes[vertex], discoveryTimes[curVertex])
				}
			})

		}

		let discoveryTimes = new Array(Object.keys(this.graph).length);
		discoveryTimes.fill(Infinity)
		let lowTimes = new Array(Object.keys(this.graph).length);
		lowTimes.fill(Infinity)
		let visited = [];
		let articulationPoints = {};
		let parents = [];

		Object.keys(this.graph).forEach(key => {
			if (visited[key] === undefined) {
				APUtil(key, visited, articulationPoints, parents, discoveryTimes, lowTimes)
			}
		})
		return articulationPoints;
	}

	findAPVia_findBridges(set) {
		let aps = [];
		const neighbours = (at) => this.graph[at].length;
		const postDfsCB = (at, to, low, ids) => (low[to] >= ids[at] && neighbours(at) > 1) ? aps.push(at) : console.log('fap',at, to, low, ids);
		this.findBridges(set, postDfsCB);
		return aps;
	}

	findBridges(set, postDfsCB) {
		this.constructAdjListFromSet_undirected(set);
		let n = Object.keys(this.graph).length + 1,
			graph = this.graph,
			id = 0,
			ids = new Array(n).fill(0),
			low = new Array(n).fill(0),
			visited = new Array(n).fill(false),
			bridges = [];

		function dfs(at, parent, bridges) {
			visited[at] = true;
			id++;
			low[at] = ids[at] = id;

			graph[at].forEach(to => {
				if (!visited[to]) {
					dfs(to, at, bridges);
					low[at] = Math.min(low[at],low[to]);
					postDfsCB ? postDfsCB(at, to, low, ids) : null;
					if (ids[at] < low[to]) {
						bridges.push(at, to);
					}
				} else if (to !== parent) {
					low[at] = Math.min(low[at], ids[to])
				}
			})
		}

		Object.keys(this.graph).forEach(vertex => {
			if (!visited[vertex]) {
				dfs(parseInt(vertex), -1, bridges)
			}
		})

		return bridges;
	}

	tarjansStronglyConnectedComponents(set) {
		// implementation of tarjans algo
		let index = 0;
		let stack = [];
		let stronglyConnectedComponents = [];
		this.constructGraphForTarjans(set);

		console.log(this.graph)

		const _dfsStrongConnect = (graphNode) => {
			graphNode.index = index;
			graphNode.lowTime = index;
			index++;
			graphNode.onStack = true;
			stack.push(graphNode);

			graphNode.connections.forEach((curNode) => {
				if (curNode !== undefined ) {
					if (!curNode.index && curNode.index !== 0) {
						_dfsStrongConnect(curNode);
						graphNode.lowTime = Math.min(graphNode.lowTime, curNode.lowTime);
					} else if (curNode.onStack) {
						graphNode.lowTime = Math.min(graphNode.lowTime, curNode.index);
					}
				}
			});

			if (graphNode.lowTime === graphNode.index) {
				console.log('AP? : ', graphNode.val, stack)
				// root node of cycle, create and output SCC
				let scc = [];
				let curNode = stack.pop();
				// console.log(stack, curNode, graphNode)
				while (curNode.val !== graphNode.val) {
					curNode.onStack = false;
					scc.push(curNode)
					curNode = stack.pop();
				}
				stronglyConnectedComponents.push(scc);
			}
		}


		Object.keys(this.graph).forEach(key => {
			let node = this.graph[key];
			if (!node.index) {
				_dfsStrongConnect(node);
			}
		});
		return stronglyConnectedComponents;
	}

	constructGraphForTarjans(set) {
		set ? this.constructAdjListFromSet_undirected(set) : null;
		Object.keys(this.graph).forEach(val => {
			let node = new Node(val, this.graph[val]);
			this.graph[val] = node;
		})
		Object.keys(this.graph).forEach(val => {
			this.graph[val].connections.forEach((conn, i) => this.graph[val].connections[i] = this.graph[conn])
		})
	}


	constructAdjListFromSet_undirected(set) {
		set.forEach(element => {
			this.addBidirectionalEdge(element[0], element[1]);
		})
	}

	addBidirectionalEdge(u,v) {
		this.addEdge(u,v);
		this.addEdge(v,u);
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
// g.addEdge(0, 1)
// g.addEdge(0, 2)
// g.addEdge(1, 2)
// g.addEdge(2, 0)
// g.addEdge(2, 3)
// g.addEdge(3, 3)
// g.BFS(2);

let s, res;
g = new Graph();
s = [[1, 2], [1, 3], [3, 4], [1, 4], [4, 5]]
res = g.findAPVia_findBridges(s)
console.log(res)
// 1, 4
g = new Graph();
s = [[1, 2], [1, 3], [2, 3], [2, 4], [2, 5], [4, 6], [5, 6]]
res = g.findAPVia_findBridges(s)
console.log(res)
// 2

g = new Graph();
s = [[1, 2], [1, 3], [2, 3], [3, 4], [3, 6], [4, 5], [6, 7], [6, 9], [7, 8], [8, 9]]
res = g.findAPVia_findBridges(s)
console.log(g.graph)
console.log(res)
// 3,4,6

return 
g1 = new Graph();
g1.addBidirectionalEdge(1, 0) 
g1.addBidirectionalEdge(0, 2) 
g1.addBidirectionalEdge(2, 1) 
g1.addBidirectionalEdge(0, 3) 
g1.addBidirectionalEdge(3, 4) 
res = g1.findArticulationPoints()
console.log(g1.graph)
console.log(res)

g2 = new Graph()
g2.addBidirectionalEdge(0, 1) 
g2.addBidirectionalEdge(1, 2) 
g2.addBidirectionalEdge(2, 3) 
res = g2.findArticulationPoints()
console.log(g2.graph)
console.log(res)


g3 = new Graph () 
g3.addBidirectionalEdge(0, 1) 
g3.addBidirectionalEdge(1, 2) 
g3.addBidirectionalEdge(2, 0) 
g3.addBidirectionalEdge(1, 3) 
g3.addBidirectionalEdge(1, 4) 
g3.addBidirectionalEdge(1, 6) 
g3.addBidirectionalEdge(3, 5) 
g3.addBidirectionalEdge(4, 5) 
res = g3.findArticulationPoints()
console.log(g3.graph)
console.log(res)