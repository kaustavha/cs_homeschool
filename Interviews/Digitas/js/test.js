import test from 'ava';

function hello(str) {
	return "Hello " + str;
}

/*
requirement -> test -> show test failure -> show test pass -> refactor
system -> shopping cart -> recieve inputs and return 1 output
input is products -> A & B, system will know A costs 10, B costs 20
customer purchases 2 A & B -> 40

new req => owner of shop wants to change prices by discount
e.g. whenever A purchased 3 times, cost of third item is 50% discounter

product b, another discount, how to add discounts
*/

// test("Adding new discounts", t =>)

test("Test discount feat every 3rd", t => {
	let cart = new Cart(),
		product = new Product("A", 20);
	cart.addDiscount("A", 3, 50);
	// test discount on 3 purchases
	for (var i = 0; i < 6; i++) {
		cart.add(product);
	}
	let expected = 100,
		actual = cart.getTotal();
	t.is(actual, expected);
});


test("Test discount feat", t => {
	let cart = new Cart(),
		product = new Product("A", 20);
	// test discount on 3 purchases
	cart.addDiscount("A", 3, 50);
	cart.add(product);
	cart.add(product);
	cart.add(product);
	let expected = 50,
		actual = cart.getTotal();
	t.is(actual, expected);
});


test("Test single product entry", t => {
	let cart = new Cart();
	cart.add(new Product("A", 20));
	let expected = 20,
		actual = cart.getTotal();
	t.is(actual, expected);
});

test("Test multiple products", t => {
	let cart = new Cart();
	cart.add(new Product("A", 10));
	cart.add(new Product("A", 10));
	cart.add(new Product("B", 20));
	let expected = 40,
		actual = cart.getTotal();
	t.is(actual, expected);
});

class Cart {
	constructor() {
		this.products = [];
		this.discounts = [];
	}
	addDiscount(productName, iteration, discount) {
		this.discounts.push({
			productName: productName,
			iteration: parseFloat(iteration),
			discount: parseFloat(discount)
		});
	}
	getTotal() {
		let sum = 0;
		for (var i = 0; i < this.products.length; i++) {
			let thisProduct = this.products[i];
			sum += thisProduct.val;
			// console.log(sum);
			for (let j=0;j<this.discounts.length; j++) {
				let discount = this.discounts[j];
				if ((i+1)%discount.iteration == 0 &&
					thisProduct.name == discount.productName) {

				// 	console.log("Debug");
				// console.log(parseFloat(thisProduct.val));
				// console.log(parseFloat(discount));
					sum -= parseFloat(thisProduct.val*(discount.discount/100));
				}
			}
			// if ((i+1)%3==0 && thisProduct.name == "A") sum -= thisProduct.val/2;
		}
		return sum;
	}
	add(product) {
		this.products.push(product);
	}
}

class Product {
	constructor(name, val) {
		this.name = name;
		this.val = val;
	}
}