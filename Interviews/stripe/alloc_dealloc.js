

function next_server_number(arr) {
	let sa = arr.sort((a,b) => {
		return a-b;
	});
	if (sa.length == 0) return 1;
	for (var i = 0; i < sa.length; i++) {
		if (parseInt(i+1) != parseInt(sa[i])) {
			return i+1;
		}
	}
	return i+1;
}

 console.log(next_server_number([5, 3, 1]))

 console.log(next_server_number([5, 4, 1, 2]))

 console.log(next_server_number([3, 2, 1]))

 console.log(next_server_number([2, 3]))

 console.log(next_server_number([]))

 console.log(next_server_number([1,4]));

 console.log(next_server_number([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]));

class Tracker {
	constructor() {
		this.servers = {};
	}
	allocate (name) {
		let id = 1;
		if (!this.servers[name]) {
			this.servers[name] = [id];
		} else {
			let nextNum = next_server_number(this.servers[name]);
			this.servers[name].push(nextNum);
			id = nextNum;
		}
		return name+id;
	}
	deallocate(str) {
		let num = str.match(/[0-9]*$/gi),
			name = str.match(/^[a-z]*/gi);
		if (this.servers[name]) {
			let list = this.servers[name];
			for (var i = 0; i < list.length; i++) {
				if (list[i] == parseInt(num)) {
					list.splice(i, 1);
					break;
				}
			}
			this.servers[name] = list;
		}
		return this.servers[name];
	}
}

let tracker = new Tracker();

console.log(tracker.allocate("apibox"))

console.log(tracker.allocate("apibox"))

console.log(tracker.deallocate("apibox1"))
console.log(tracker.allocate("apibox"))
console.log(tracker.allocate("sitebox"))
for (var i = 0; i < 10; i++) {
	tracker.allocate('apibox');
}

console.log(tracker.servers);

console.log(tracker.deallocate("apibox10"))

console.log(tracker.servers);
