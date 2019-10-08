/**
 * Given a input list of jobs
 * Each with a name and dependencies
 * Create and return a DAG
 * Throw error if cycle exists
 * 
 * ExampleIn = [{
 *  name: 'Jenkins'
 * }, {
 * name: 'git',
 * deps:'Jenkins'}]
 * 
 * 
 * ExampleIn Fail = [{
 *  name: 'Jenkins'
 * }, {
 * name: 'git',
 * deps:['Jenkins']
 * },{
 * name: 'git',
 * deps:['Jenkins']
 * },{
 * name: 'java',
 * deps: ['jenkins', 'git', 'c']
 * }, {
 * name: 'ruby',
 * deps: [java', 'git']
 * },{
 * name: 'c',
 * deps: ['ruby', 'git']
 * }]
 */

function generateGraph(inputArray) {
    let adjList = createAdjList(inputArray);
    let adjGraph = createAdjGraph(adjList);
    let cycleDetected = detectCycles(adjGraph);

    function createAdjList(inputArray) {
        let out = {};
        inputArray.forEach(element => {
            out[element.name] = element.deps;
        });
        return out;
    }

    function createAdjGraph(adjList) {
        class Node {
            constructor(name, deps) {
                this.name = name;
                this.deps = deps;
                this.children = [];
            }
            addChild(node) {
                this.children.push(node);
            }
        }
        let adjGraph = adjList;

        for (let key in adjList) {
            let deps = adjList[key];
            let node = new Node(key, deps);
            adjGraph[key] = node;
        }

        for (let key in adjGraph) {
            adjGraph[key].deps.forEach(dep => {
                adjGraph[dep].addChild(adjGraph[key]);
            });
        }

        return adjGraph;
    }


    function detectCycles(adjGraph) {
        function _detectCycles(root, seenKeySet) {
            let name = root.name;
            if (seenKeySet[name]) return true;
            if (!root.children) return false;
            seenKeySet[name] = true;
            let seen = false;
            root.children.forEach(child => {
                seen = seen ? seen : _detectCycles(child, seenKeySet);
            });
            return seen;
        }

        adjGraph.forEach(key => {
            let seenKeySet = {};
            let node = adjGraph[key];
            let cycleDetected = _detectCycles(node, seenKeySet);
            if (cycleDetected) return true;
        });
        return false;
    }

    return cycleDetected ? `Cycle detected ${adjGraph}` : adjGraph;
}