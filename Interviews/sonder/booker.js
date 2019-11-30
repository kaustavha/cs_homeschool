

// todo pp output

function booker(calendarArr, bookings) {
    // let calendarArrCopy = []
    // console.log(calendarArr, bookings)
    bookings.forEach(booking => {
        calendarArr.forEach((cal, i) => {
            console.log(_grabSingles(cal))


            let res = assign(booking, cal);
            if (res !== false) {
                calendarArr[i] = res;
            }
        })
    });
    return calendarArr;
}


function prettyPrint(cals) {
    let resCals = [];
    cals.forEach(cal => {
        cal = cal.map(id => id === 0 ? '-' : id);
        resCals.push(cal)
    })
    console.log(resCals);
    // return cals;
}

function grabSingles(cals) {
    let res = [];
    cals.forEach(cal => {
        res.push(_grabSingles(cal))
    })
    return res;
}

function _grabSingles(cal) {
    let curId = false;
    let count = 0;
    let cin = 0;
    let singles = [];
    cal.forEach((id, i) => {
        if (!curId) {
            curId = id;
            cin = i;
        }
        if (curId === id) {
            count++;
        } else {
            if (count === 1) {
                singles.push({
                    id: id,
                    check_in: cin,
                    check_out: cin+1
                })
            }

            count = 1;
            curId = id;
            cin = i;
        }
    })
    return singles;
}

// function isPossible() {}
// function tryMove(cals, cin, cout) {
//     let leastOccupiedCal = findLeast(cals, cin, cout);
//     let i = cin;

//     while (i < cout) {
//         if ()
//         i++;
//     }
// }

// function _tryMove(cal, cin, cout) {
//     let i = cin;

//     let newBookings = [];

//     let id;

//     while (i < cout) {
//         if (cal[i] !== 0) {
//             if (!id || id !== cal[i])  {
//                 id = cal[i];
//                 let newBooking = {
//                     id: id,
//                     check_in: i
//                 }
//                 newBookings.push(newBooking)
//             }
//         }
//         i++;
//     }
// }

function assign(booking, calendar) {
    // console.log(booking, calendar)
    let cin = booking.check_in,
        cout = booking.check_out,
        bookId = booking.id,
        possible = true;

    let i = cin;

    while (i < cout) {
        if (calendar[i] !== 0) possible = false;
        i++;
    }

    if (!possible) return false;


    i = cin;
    while (i < cout) {
        calendar[i] = bookId;
        i++;
    }

    return calendar;
}


let units, bookings;
const test = (units, bookings) => prettyPrint(booker(units, bookings));

units = [
    [241, 241, 241, 0,   0, 367, 367, 0, 0, 198, 198, 198, 0, 0, 0], 
    [0,   0,   193, 193, 0, 0,   0,   0, 0, 0,   0,   0,   0, 0, 0], 
]
bookings = [
    { "id": 729, "check_in": 3, "check_out": 5 },
    { "id": 184, "check_in": 6, "check_out": 7 },
    { "id": 399, "check_in": 8, "check_out": 13 },
]
test(units, bookings)


units = [
    [900, 900, 900, 0,   281, 281, 0,   0,   0,   831, 831, 831, 0,   0, 0],
    [0,   0,   0,   768, 0,   278, 465, 465, 465, 0,   0,   0,   444, 0, 0] 
]
bookings = [
    { "id": 983, "check_in": 3, "check_out": 5 },
    { "id": 290, "check_in": 0, "check_out": 3 },
    { "id": 100, "check_in": 12, "check_out": 14 }
]
test(units, bookings)


units = [
    [0, 190, 0,  0,   680, 680, 0,   0,   902, 0,   397, 0, 700, 0,   459],
    [0, 0,   0,  0,   166, 166, 166, 0,   0,   601, 0,   0, 358, 0,   129],
    [0, 757, 0,  130, 130, 130, 0,   0,   0,   0,   561, 0, 0,   735, 0],
    [0, 0,   0,  0,   0,   0,   723, 723, 0,   0,   0,   0, 0 ,  0,   0]
]
bookings = [
    { "id": 289, "check_in": 0, "check_out": 2 },
    { "id": 678, "check_in": 1, "check_out": 2 },
    { "id": 800, "check_in": 5, "check_out": 9 },
    { "id": 222, "check_in": 7, "check_out": 11 },
    { "id": 685, "check_in": 7, "check_out": 13 },
]
test(units, bookings)
