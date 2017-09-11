/*
 * Complete the function below.
 */
function bestAverageGrade(scores) {
    if (scores.length == 0) return 0;
    if (scores.length == 1) return scores[0][1];
    let bestAvg, obj={};
    for (var i = 0; i < scores.length; i++) {
        let name = scores[i][0], mark=Number(scores[i][1]);
        if (obj[name] !== undefined) {
            let avg = (obj[name] + mark)/2;
            obj[name] = avg;
        } else {
            obj[name] = mark;
        }
    }
    for (name in obj) {
        if (!bestAvg) bestAvg = obj[name];
        if (obj[name] > bestAvg) bestAvg = obj[name];
    }
    return Math.floor(bestAvg);
}

console.log(bestAverageGrade([["s", "0"], ["s", "0"], ["1", "1"]]));