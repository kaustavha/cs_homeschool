//  ┌────┐         ┌────┐
//  │h   │         │e   │
//  │hive│────────▶│hive│───────┐
//  └────┘         └────┘       │
//     │                        ▼
//     └──────────┐          ┌─────┐     ┌─────┐
//                ▼          │b    │     │a    │
// ┌────┐      ┌────┐   ┌───▶│spark│────▶│mysql│
// │g   │      │f   │   │    └─────┘     └─────┘
// │hive│─────▶│hive│───┘                   ▲
// └────┘      └────┘        ┌────┐         │
//                           │c   │         │
//                           │hive│─────────┘
//                           └────┘     ┌─────┐
//                              │       │d    │
//                              └──────▶│mysql│
//                                      └─────┘
/**
 * 
 * Node
 *   name
 *   type
 *   dependencies
 * 
 * 
 * List of nodes
 * -> adjancy list 
 * -> adjancy graph
 * 
 * class Node {
     constructor() {
         name: 
         type:
         dependencies: 
     }

 * 
 * 
 * {
     name: a,
     type: mysql
     deps: []
 },{
     name: d,
     type: mysql,
     deps: []
 }, {
     name: c,
     type: hive.
     deps: [a, d]
 }
 */

// 


/**
 * 
 */
class GraphNode {
    constructor(name, type, deps) {
        this.name = name;
        this.type = type;
        this.deps = deps;
        this.dependedOnBy = [];
    }
    getDependencies() {
        return this._getDependencies(this.deps, 'deps');
    }
    getDependedOnBy() {
        return this._getDependencies(this.dependedOnBy, 'dependedOnBy');
    }
    _getDependencies(depsArr, key) {
        function _getDepsFromChildren(outObj, deps) {
            deps.forEach(depNode => {
                outObj[depNode.name] = depNode;
                if (depNode[key].length > 0) {
                    outObj = _getDepsFromChildren(outObj, depNode[key])
                }
            });
            return outObj;
        }
        let outObj = _getDepsFromChildren({}, depsArr);
        return Object.values(outObj);
    }
}

class Graph {
    constructor(jsonObjArr) {
        this.graph = this.populateGraph(jsonObjArr);
    }
    populateGraph(jsonObjArr) {
        let out = {};
        jsonObjArr.forEach(incomingNodeDef => {
            let newNode = new GraphNode(
                incomingNodeDef.name,
                incomingNodeDef.type,
                incomingNodeDef.deps
            );
            out[incomingNodeDef.name] = newNode;
        });
        Object.values(out).forEach(node => node.deps.forEach((dep, i) => {
            node.deps[i] = out[dep];
            out[dep].dependedOnBy.push(node);
        }));
        return out;
    }
    detectCycles() {
        let cycleDetected = false;
        function _detectCycles(mapset, root) {
            let name = root.name;
            if (mapset[name]) {
                cycleDetected = true;
                return;
            }
            if (root.deps.length == 0) return;
            mapset[name] = true;
            root.deps.forEach(node => {
                _detectCycles(mapset, node);
            });
        }
        Object.values(this.graph).forEach(node => _detectCycles({}, node));
        return cycleDetected;
    }
    getNode(nodeName) {
        return this.graph[nodeName]
    }
}

let test = [{
    name: 'a',
    type: 'mysql',
    deps: ['x']
}, {
    name: 'd',
    type: 'mysql',
    deps: ['x']
}, {
    name: 'x',
    type: 'mysql',
    deps: []
}, {
    name: 'c',
    type: 'hive',
    deps: ['a', 'd']
}]

let g = new Graph(test)
let n = g.getNode("c")
console.log(n)
let n2 = n.deps[0]
console.log(n2)
console.log(g.detectCycles())
console.log(n.getDependencies())
console.log(g.getNode("c").getDependencies())
console.log(g.getNode("d").getDependencies())
console.log(g.getNode("a").getDependencies())
console.log(g.getNode("x").getDependencies())
console.log(g.getNode("x").getDependedOnBy())
