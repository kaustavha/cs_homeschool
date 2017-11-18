let http = require('https');
let url = 'https://backend-challenge-winter-2017.herokuapp.com/customers.json';

/// Can age be null if not reqd?

///

function getData(pageNum, cb) {
	if (pageNum > 0) {
		api = url + '?page='+pageNum;
	} else {
		api = url;
	}
	http.get(api, (res) => {
		res.on('data', (chunk) => {
			cb(JSON.parse(chunk));
		});
	});
}

function validate(validations, customer) {
	let out = {
		id: customer.id,
		invalid_fields: []
	};
	validations.forEach((validator) => {
		let field = Object.keys(validator),
			isRequired = validator[field].required ? true : false,
			type = validator[field].type,
			length = validator[field].length,
			invalidField = false;
		if (isRequired == true) {
			if (customer[field] == null) return out.invalid_fields.push(field[0]);
		}
		if (type && type !== null) {
			if (typeof customer[field] !== type) return out.invalid_fields.push(field[0]);
		}
		if (length) {
			if (length.min) {
				if (customer[field].length < length.min) return out.invalid_fields.push(field[0]);
			}
			if (length.max) {
				if (customer[field].length > length.max) return out.invalid_fields.push(field[0]);
			}
		}
		
	});

	if (out.invalid_fields.length == 0) {
		return {};
	} else {
		return out;
	}
}

function validatePage(customers, validations) {
	let out = [];
	customers.forEach((customer) => {
		var isValid = validate(validations, customer);
			if (isValid.id) {
				out.push(isValid);
			}
		});
	return out;
}

function recurse(pageNum, validations, invalids, processed, total) {
	getData(pageNum, (data) => {
		let newInvalids = validatePage(data.customers, validations);
		invalids = invalids.concat(newInvalids);
		processed += data.customers.length;
		if (processed < total) {
			pageNum++;
			recurse(pageNum, validations, invalids, processed, total)
		} else {
			print({invalid_customers: invalids});
		}
	});
}

function print(data) {
	console.log('Finished processing: ');
	console.log(JSON.stringify(data, null, 2));
	return data;
}

function main() {
	let out = {invalid_customers: []};
	getData(0, (data) => {
		let validations = data.validations,
		customers = data.customers,
		total = data.pagination.total,
		validated = customers.length,
		pageNum = 1;
		let resp = validatePage(customers, validations);
		recurse(2, validations, resp, validated, total);
	});
}


main();