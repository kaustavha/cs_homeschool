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
 }
 * /
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
 class Node {
     constructor(name, type, deps) {
         this.name = name;
         this.type = type;
         this.deps = deps;
         this.dependedOnBy = [];
     }
     getDependencies() {
         function _getDepsFromChildren(outObj, deps) {
             deps.forEach(depNode => {
                 outObj[depNode.name] = depNode;
                //  outArr.push(depNode);
                 if (depNode.deps.length > 0) {
                     outObj = _getDepsFromChildren(outObj, depNode.deps)
                 }
             });
             return outObj;
         }
         let outObj = _getDepsFromChildren({}, this.deps);
         let outArr = [];
         for (let key in outObj) {
             outArr.push(outObj[key])
         }
         return outArr;
     }
     
 }
 class Graph {
     constructor(jsonObjArr) {
         this.graph = this.populateGraph(jsonObjArr);
     }
     
     populateGraph(jsonObjArr) {
         let out = {};
         jsonObjArr.forEach(incomingNodeDef => {
             let newNode = new Node(
                 incomingNodeDef.name,
                 incomingNodeDef.type,
                 incomingNodeDef.deps
                 );
             out[incomingNodeDef.name] = newNode;
         });
         
         for (let key in out) {
             let node = out[key];
            //  console.log(out[key])
             node.deps.forEach((dep, i) => {
                 out[key].deps[i] = out[dep];
                 out[dep].dependedOnBy.push(node);
             });
            //  console.log(out)
         }
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
             mapset[name] = true;
             if (root.deps.length == 0) return;
             root.deps.forEach(node => {
                 _detectCycles(mapset, node);
             });
         }
         for (let key in this.graph) {
             let startNode = this.graph[key];
             _detectCycles({}, startNode);
         }
         return cycleDetected;
     }
     getNode(nodeName) {
        //  console.log(this.graph)
         return this.graph[nodeName]
     }
     
 }
 
 let test = [{
     name: 'a',
     type: 'mysql',
     deps: ['x']
 },{
     name: 'd',
     type: 'mysql',
     deps: ['x']
 },{
     name: 'x',
     type: 'mysql',
     deps: []
 },{
     name: 'c',
     type: 'hive',
     deps: ['a', 'd']
 }]
 
 g = new Graph(test)
 let n = g.getNode("c")
 console.log(n)
 let n2 = n.deps[0]
 console.log(n2)
 console.log(g.detectCycles())
 console.log(n.getDependencies())