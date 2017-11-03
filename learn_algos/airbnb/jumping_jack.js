
/*
 * Complete the function below.
 */
function maxStep(n, k) {
    let resStep = 0, lastStep=0;
    for (let i=1;i<=n;i++) {
        if (resStep+i == k) {
            // revert last step
            resStep -= lastStep;
        }
        
        if (resStep+i != k) {
            resStep += i;
            lastStep = i;
        }
    }
    return resStep;

}
