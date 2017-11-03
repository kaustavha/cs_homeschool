// var input = Airbnb Online Assessment Paginate List 

// 5 
// 13 
// 1,28,310.6,SF 
// 4,5,204.1,SF 
// 20,7,203.2,Oakland 
// 6,8,202.2,SF 
// 6,10,199.1,SF 
// 1,16,190.4,SF 
// 6,29,185.2,SF 
// 7,20,180.1,SF 
// 6,21,162.1,SF 
// 2,18,161.2,SF 
// 2,30,149.1,SF 
// 3,76,146.2,SF 
// 2,14,141.1,San Jose 


// Here is a sample input. It’s a list generated by user search. 
// (1,28,100.3,Paris) corresponds to (Host ID, List ID, Points, City). 

// 5 in the first row tells each page at most keeps 5 records. 
// 13 in the second row is the number of records in the list. 

// Please paginate the list for Airbnb by requirement: 
// 1. When possible, two records with same host ID shouldn’t be in a page. 
// 2. But if no more records with non-repetitive host ID can be found, fill up the page with the given input order (ordered by Points). 

// Expected output: 
// 1,28,310.6,SF 
// 4,5,204.1,SF 
// 20,7,203.2,Oakland 
// 6,8,202.2,SF 
// 7,20,180.1,SF 

// 6,10,199.1,SF 
// 1,16,190.4,SF 
// 2,18,161.2,SF 
// 3,76,146.2,SF 
// 6,29,185.2,SF -- 6 repeats in page bec no more unique host ID available 

// 6,21,162.1,SF 
// 2,30,149.1,SF 
// 2,14,141.1,San Jose


var input = `5 
13 
1,28,310.6,SF 
4,5,204.1,SF 
20,7,203.2,Oakland 
6,8,202.2,SF 
6,10,199.1,SF 
1,16,190.4,SF 
6,29,185.2,SF 
7,20,180.1,SF 
6,21,162.1,SF 
2,18,161.2,SF 
2,30,149.1,SF 
3,76,146.2,SF 
2,14,141.1,San Jose `;

console.log(input);

console.log('===================');


// Assuming input list is sorted in desc of pts:
// Run through lines, 
// push lines into page and keep track of hostid, 
// if non-uniq hostid for this page encountered then push into queue and keep going
// next page, start with queue then keep going through lines.


var lines = input.split('\n'),
	itemsPerPg = lines.shift(),
	totalItems = lines.shift();


var page = {}, pglines = [], queue=[], pages = '';

function writePage() {
	pages += pglines.join('\n') + '\n\n';
	pglines = [];
	page = {};
}

function insertDistinct(inqueue, outqueue, secondRun) {
	while (inqueue.length > 0 && pglines.length < itemsPerPg) {
		let line = inqueue.shift(),
		lineTxt = line[4],
		hostId = line[0];
		if (!page[hostId]) {
			page[hostId] = true;
			pglines.push(lineTxt);
		} else {
			outqueue.push(line);
		}
	}
	if (inqueue.length > 0) outqueue = outqueue.concat(inqueue);
	if (pglines.length < itemsPerPg && outqueue.length > 0 && secondRun) {
		// not at page limit with non distinct leftovers and no chance of finding more
		insertAll(outqueue);
	} else if (pglines.length == itemsPerPg && inqueue.length > 0) {
		// at page limit with left over items
		writePage();
		insertDistinct(inqueue, outqueue, secondRun);
	} else if (pglines.length == itemsPerPg && inqueue.length == 0 && outqueue.length > 0) {
		// at page limit with no distinct leftovers
		writePage();
		insertDistinct(outqueue, [], secondRun);
	}
	return outqueue;
}

function insertAll(queue) {
	while (queue.length > 0 && pglines.length < itemsPerPg) {
		let line = queue.shift(),
			lineTxt = line[4];
		pglines.push(lineTxt);
	}
	if (pglines.length == itemsPerPg) {
		writePage();
	}
	if (queue.length > 0) {
		insertDistinct(queue, [], true);
	}
}

for (var i in lines) {
	let line = lines[i].split(','),
		hostId = line[0],
		pts = line[2];
	
	// empty out queue from last page
	if (!page[hostId]) {
		page[hostId] = true;
		pglines.push(lines[i]);
	} else {
		// console.log(lines[i]);
		line.push(lines[i]);
		queue.push(line);
	}
	// if at page boundary, create new page and empty queue if full
	if (pglines.length == itemsPerPg) {
		writePage();
		if (queue.length > 0) {
			queue = insertDistinct(queue, []);
		}
	}
}
insertAll(queue);
if (pglines.length > 0) writePage();
console.log(pages);


// if input list is sorted we can just use a queue otherwise we need a priority queue



// if input isnt sorted



// Solution using linked lists?

class Node {
	constructor(prev, txt, hostId, next) {
		this.next = next;
		this.prev = prev;
		this.txt = txt;
		this.hostId = hostId;
	}
}

class Page {
	constructor() {
		this.hostIds = {};
		this.lines = '';
		this.length = 0;
		this.next = null;
	}
	insert(hostId, line) {
		this.hostIds[hostId] = true;
		this.lines += line + '\n';
		this.length++;
	}
}


var totalPages = Math.round(totalItems/itemsPerPg);

var page = new Page();

let tmpPg = page;
for (let i=1; i<totalPages; i++) {
	page.next = new Page();
	page = page.next;
}
page = tmpPg;

var qmap = {}, len = 0;
var pre = new Node();
var l = pre;

for (var i in lines) {
	let txt = lines[i],
		line = txt.split(','),
		hostId = line[0],
		pts = line[2];

	let tempPg = page;
	var success = false;
	while (tempPg) {
		if (!tempPg.hostIds[hostId] && tempPg.length < itemsPerPg) {
			success = true;
			tempPg.insert(hostId, txt);
			break;
		}
		tempPg = tempPg.next;
	}

	if (!success) {
		pre.next = new Node(pre, txt, hostId);
		pre = pre.next;
		len++;
	}
}

let tn = l.next;

while (tn) {
	let ptr = page;
	while (ptr) {
		if (ptr.length < itemsPerPg) {
			ptr.insert(tn.hostId, tn.txt);
			break;
		}
		ptr = ptr.next;
	}
	tn = tn.next;
}

console.log('Linked list solution set');
while (page) {
	console.log(page.lines);
	page = page.next;
}
