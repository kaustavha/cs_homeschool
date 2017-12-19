var http = require('http');
const KvStore = require("./ttkv_practice.js");

const kvs = new KvStore();


const server = http.createServer();

let rateLimit = 100;
let user_req_map = {};
var limitPendingTime = 0;

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function clearLimit(ip, time) {
	await sleep(time)
	user_req_map[ip] = []
}

server.on("request", (req, res) => {

	req.socket.on("error", () => {
		console.log("socket erred out")
	})

	let ip = req.socket.localAddress;
	ts = kvs.add(ip, req);
	// if (ts)
	if (!user_req_map[ip]) user_req_map[ip] = [];
	user_req_map[ip].push(ts);

	let len = user_req_map[ip].length;

	if (len >= rateLimit && user_req_map[ip][0]-user_req_map[ip][len-1] < 1000) {
		// do rate limiting
		console.log("rate limiting in progress")
		if (limitPendingTime == 0) limitPendingTime = Date.now()
		clearLimit(ip, 1000)
		res.setHeader("Retry-After", 1-(Date.now() - limitPendingTime))
		res.end("429", 'Rate limit exceeded, try again in ' + 1-(Date.now() - limitPendingTime))
	}

	// console.log(req);
	res.end("done")
	console.log("ip:", req.socket.localAddress);
	// console.log(res);
});

server.listen(1337, '127.0.0.1', ()=>{
	console.log('listening on 127.0.0.1:1337')
	// const opts = {
	// 	port: 1337,
	// 	hostname: '127.0.0.1',
	// 	method: 'CONNECT'
	// }
	// const req = http.request(opts)
	// // req.end()
	// req.on('connect', (res, socket, head) => {
	// 	console.log("connected!")
	// })
})
server.close();
