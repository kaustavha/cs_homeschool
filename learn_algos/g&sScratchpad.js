/*
 * Complete the function below.
 */
function bestAverageGrade(scores) {
    let bestAvg, bestAvgN, obj={};
    for (var i = 0; i < scores.length; i++) {
        let name = scores[i][0], mark=Number(scores[i][1]);
        if (obj[name] !== undefined) {
            let avg = Math.floor((obj[name] + mark)/2);
            obj[name] = avg;
        } else {
            obj[name] = mark;
        }
    }
    for (name in obj) {
        if (!bestAvg) bestAvg = obj[name];
        if (obj[name] > bestAvg) bestAvg = obj[name];
    }
    return bestAvg;
}

let arr = [["b","87"], ["c","100"], ["e","64"], ["c","22"]];
console.log(bestAverageGrade(arr));
