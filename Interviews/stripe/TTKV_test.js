let TTKV = require("./TTKV.js");

let ttkv = new TTKV();

ttkv.put("a", 10)
let ts = Date.now();
ttkv.put("a", 20);
let ts2 = Date.now();

console.log(ttkv.get("a", ts))

console.log(ttkv.get("a", ts2))


console.log(ttkv.get("a", ts-100))

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

let oldTs = [];

async function populate() {
    for (let i=0; i<10; i++) {
        oldTs.push(Date.now())
        ttkv.put("a", i);
        await sleep(100)
    }
}

console.log("===============")

populate().then(() => {
    console.log(ttkv.get("a",0))
    console.log(ttkv.get("a", Date.now()+100000000))
    console.log(ttkv.get("a", oldTs[9]))
    console.log(ttkv.get("a", oldTs[5]))
    console.log(ttkv.get("a", oldTs[0]))


    ttkv.put(1, "a")
    console.log(ttkv.get(1, Date.now()+1000))
})
