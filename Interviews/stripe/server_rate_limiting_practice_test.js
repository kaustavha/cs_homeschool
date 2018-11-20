const http = require('http')
const opts = {
		port: 1337,
		hostname: '127.0.0.1',
		method: 'CONNECT'
	}
const req = http.request(opts, (res) => {
	res.on('end', () => {console.log("res1 ended")})
})
req.on('connect', (res, socket, head) => {
	console.log("connected!")
})
req.end()

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function overflowRateLimit() {
	for (let i=0; i<110; i++) {
		http.get('http://127.0.0.1:1337', res => {
			res.on('data', data => console.log(data+''));
		});
	}
	await sleep(1200)
}

options = {
	port: 1337,
	method: "POST"
}
const keepAliveAgent = new http.Agent({keepAlive: true})
options.agent = keepAliveAgent

const req2 = http.request(options, (res) => {
	console.log("done");
	res.on('data', c => console.log(c+''))
	res.on('end', () => {console.log("res ended")})
});

req2.write("post data");
req2.end();

// overflowRateLimit().then(() => {
// 	console.log("waiting a second")
// 	overflowRateLimit();
// });

// req.once('response', (res) => {
// 	const ip = req.socket.localAddress;
// 	const port = req.socket.localPort;
// 	console.log(`Your IP address is ${ip} and your source port is ${port}.`);
// 	// consume response object
//   });

