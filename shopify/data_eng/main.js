let fs = require('fs');


function getData(fileName) {
	return require('./'+fileName);
}

function join(file1, file2, key1, key2) {
	let out = [],
		data1 = getData(file1),
		data2 = getData(file2);
	data1.forEach((row) => {
		label1 = row[key1];
		data2.forEach((dat) => {
			if (dat[key2] == label1) {
				out.push(Object.assign({}, row, dat));
			}
		});
	});
	return out;
}

function countOrderTotal(name, joinedArr) {
	let total = 0;
	for (var i = 0; i < joinedArr.length; i++) {
		if (joinedArr[i].name == name) {
			total += joinedArr[i].price;
		}
	}
	return total;
}

function singleOveroptimizedFunc(file1, file2, key1, key2, name1, name2) {
	let out = {
			joinedArr: [],
			[name1]: 0,
			[name2]: 0
		},
		data1 = require('./' + file1),
		data2 = require('./' + file2);
	data1.forEach((row) => {
		label1 = row[key1];
		data2.forEach((dat) => {
			if (dat[key2] == label1) {
				out.joinedArr.push(Object.assign({}, row, dat));
				if (row.name == name1) {
					out[name1] += dat.price;
				} else if (row.name == name2) {
					out[name2] += dat.price;
				}
			}
		});
	});
	console.log(out);
	console.log(out.joinedArr.length);
	console.log(out[name1]);
	console.log(out[name2]);
}

let joinedArr = join('customers.json', 'orders.json', 'cid', 'customer_id');
let totalBarry = countOrderTotal('Barry', joinedArr);
let totalSteve = countOrderTotal('Steve', joinedArr);
console.log(joinedArr.length);
console.log(totalBarry);
console.log(totalSteve);

console.log('---');

singleOveroptimizedFunc('customers.json', 'orders.json', 'cid', 'customer_id', 'Barry', 'Steve');