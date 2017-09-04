//create shuffled intArr 
let intArr = [];
for (var i = 0; i < 10; i++) {
    let rand = Math.floor(Math.random() * 10);
    intArr.push(rand);
}

console.log(intArr);

// Mergesort

function Mergesort(arr) {
    if (arr.length <= 1) return arr;
    let mid = Math.floor(arr.length/2),
        length = arr.length,
        left = arr.splice(0, mid),
        right = arr;

    left = Mergesort(left);
    right = Mergesort(right);

    return _merge(left, right);
}

function _merge(a, b) {
    let o = [], i = 0;

    if (a !== undefined && b !== undefined) {
        while (a.length > 0 && b.length > 0) {
            if (a[0] < b[0]) {
                o.push(a.shift());
            } else if (b[0] < a[0]) {
                o.push(b.shift());
            } else if (b[0] == a[0]) {
                o.push(b.shift());
                o.push(a.shift());
            }
        }
    }
    if (a == undefined || a.length ==0 && b !== undefined) {
        o = o.concat(b);
    } else if (b == undefined || b.length == 0 && a !== undefined) {
        o = o.concat(a);
    }
    return o;
}

let sorted = Mergesort(intArr);
console.log(sorted);
