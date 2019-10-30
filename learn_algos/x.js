// /*
//  * Complete the function below.
//  */
// function bestAverageGrade(scores) {
//     if (scores.length == 0) return 0;
//     if (scores.length == 1) return scores[0][1];
//     let bestAvg, bestAvgN, obj={}, obj2={};
//     for (var i = 0; i < scores.length; i++) {
//         let name = scores[i][0], mark=Number(scores[i][1]), oldAvg = obj[name];
//         if (obj[name] !== undefined) {
//             let avg = (oldAvg + mark)/2;
//             obj[name] = avg;
//         } else {
//             obj[name] = mark;
//         }
//         let obj2i = name+oldAvg;
//         delete
//         if (obj2[name+oldAvg])
//     }
//     for (name in obj) {
//         if (!bestAvg) bestAvg = obj[name];
//         if (obj[name] > bestAvg) bestAvg = obj[name];
//     }
//     return Math.floor(bestAvg);
// }


// class Checker {
//     constructor() {
//         this.board = {};
//     }

//     add(pos, color) {
//         if (this.contains(pos)) {
//             this.board[pos].value.push(color);
//         } else {
//             this.create(pos, color);
//         }
//     }

//     contains(pos) {
//         if (this.board[pos]) return true;
//         return false;
//     }

//     create(pos, color) {
//         this.board[pos] = [color];
//     }
// }

let input
function main() {
    let sorted=true, lastNum = false;

    let arrays = [], row=[];
    for (var i = 0; i < input.length; i++) {
        let thisNum = parseInt(input[i]);

        if (!isNaN(thisNum)) {
            row.push(thisNum);
            if (!lastNum) {
                lastNum = thisNum;
            }
            if (lastNum > thisNum) {
                sorted = false;
            }
            lastNum = thisNum;
        } else if (input.charCodeAt(i) == 10) {
            lastNum = false;
            arrays.push(row);
            row = [];
        }

    }
    arrays.push(row);
    let rowl = arrays[0].length;
    for (var i = 0; i < rowl; i++) {
        let lastNum= false;
        for (var j = 0; j < arrays.length; j++) {
            let thisNum = arrays[j][i];
            if (!lastNum) {lastNum=thisNum};
            if (lastNum > thisNum) {
                sorted = false;
            }
            lastNum = thisNum;
        }
    }

    if (sorted) {

    }
    console.log(sorted ? 'sorted' : 'not sorted');

}
main();

  out = [];
  for (var i = 1; i <= n; i++) {
    temp = "";
    if (n[i]%p == 0) {
      temp += "OUT";
    }
    if (n[i].toString().indexOf(q) > -1) {
      temp += "THINK"
    }
    if (temp.length != 0) {
      out.push(temp);
      temp = "";
    } else {
      out.push(i);
    }
  }
