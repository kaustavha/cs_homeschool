const KvStore = require("./square3_practice.js");

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

let lastTs = null;

let kvs = new KvStore();

async function populate() {
	for (let i=0; i<10; i++) {
		lastTs = kvs.add("a", i)
		await sleep(100)
	}
}

populate().then(()=>{
	console.log("start kvs")

	console.log(kvs.getFirst("a"))
	
	console.log(kvs.getLast("a"))
	
	console.log("last time stamp", lastTs)
	console.log(kvs.getAtTime("a", lastTs))
});