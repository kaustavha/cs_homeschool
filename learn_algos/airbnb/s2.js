
class Node {
	constructor(prev, txt, hostId, next) {
		this.next = next;
		this.prev = prev;
		this.txt = txt;
		this.hostId = hostId;
	}
	remove() {
		if (this.next && this.next.prev && this.prev) this.next.prev = this.prev;
		if (this.prev && this.prev.next && this.next) this.prev.next = this.next;
	}
}

class Page {
	constructor() {
		this.hostIds = {};
		this.lines = [];
		this.length = 0;
		this.next = null;
	}
	insert(hostId, line, res) {
		this.hostIds[hostId] = true;
		this.lines.push(line);
		this.length++;
	}
}


// var totalPages = Math.round(totalItems/num);
// var output = [];
// var page = new Page();
// var pre = new Node();
// var l = pre; // maintain root ptr

//     var page = new Page();
// var qmap = {};
// var head = new Node();
// var pre = head;
//     let totalPages = results.length/num;

function paginate(num, results) {
	let totalPages = Math.round(results.length/num),
		pgHead = new Page(),
		qmap = {},
		listHead = new Node(),
		pre = listHead,
		tmpPg = pgHead,
		output = [];

	function newPage(LL, pg) {
		let pg2;
		if (pg.next) {
			pg2 = pg.next;
		} else {
			pg2 = new Page();
			pg.next = pg2;
		}
		let ret = insertUniqs(LL, pg2);
		LL = ret[0];
		pg = ret[1];
		return [LL,pg];
	}

	function insertUniqs(LL, pg) {
		let ptr = pg,
			tn = LL;
		while (tn.next) {
			tn = tn.next;

			if (!ptr.hostIds[tn.hostId] && ptr.length < num) {
				ptr.insert(tn.hostId, tn.txt);
				tn.remove();
				if (qmap[tn.hostId]) {
					if (qmap[tn.hostId].length == 1) {
						delete qmap[tn.hostId];
					} else {
						qmap[tn.hostId].shift();
					}
				}
			}


			if (ptr.length == num) ptr = newPage(LL, ptr);
		}
		return [LL, pg];
	}

	for (var i in results) {
		let txt = results[i],
			line = txt.split(','),
			hostId = line[0],
			pts = line[2];

		// console.log(txt);
		if (tmpPg.length == num) {
			output.push("");
			let ret = newPage(listHead, tmpPg);
			tmpPg = ret[1];
			listHead = ret[0];
		}

		if (!tmpPg.hostIds[hostId]) {
			output.push(txt);
			tmpPg.insert(hostId, txt);
		} else {
			let tn = new Node(pre, txt, hostId);
			if (!qmap[hostId]) {
				qmap[hostId] = [];
			}
			// track all uniq ids to save time inserting uniqs later
			qmap[hostId].push(tn);
			pre.next = tn;
			pre = pre.next;
		}
	}


	let tmp = pgHead;
	// loop through pages since pagenumber denotes priority/access to early eles in list
	
	for (var i = 0; i < totalPages; i++) {
			if (tmp.length == num) {
				tmp = tmp.next;
				continue;
			}
			var uniqsExist = false;
			for (let k in qmap) {
				if (!tmp.hostIds[k]) uniqsExist = true;
				break;
			}
			let tn = listHead;
			if (uniqsExist) {
				while (tn.next && tmp.length < num) {
					tn = tn.next;
					if (!tmpPg.hostIds[tn.hostId]) {
						output.push(tn.txt);
						tmp.insert(tn.hostId, tn.txt);
						tn.remove();
						if (qmap[tn.hostId].length > 1) {
							qmap[tn.hostId].shift();
						} else {
							delete qmap[tn.hostId];
						}
					}
				}
			}
			// non uniqs run, insertall
			tn = listHead;
			while (tn.next && tmp.length < num) {
				tn = tn.next;
				output.push(tn.txt);
				tmp.insert(tn.hostId, tn.txt);
				tn.remove();
				if (qmap[tn.hostId].length > 1) {
					qmap[tn.hostId].shift();
				} else {
					delete qmap[tn.hostId];
				}
			}
			if (!tmp.next && tmp.length == num && i < totalPages) {
				output.push("");
				let ret = newPage(listHead,tmp);
				tmp.next = ret[1];
				l = ret[0];
			}
			tmp = tmp.next;

	}
	// return to head
	// tmp = pgHead;
	return output;
}