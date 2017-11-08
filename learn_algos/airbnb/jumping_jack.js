/*
given 2 numbers, n steps to take and step to avoid k
can jump n steps fwd at each step n
must maximize steps without stepping on step to avoid k
can jump over k by landing on a previous step w/ more slots

e.g. in
3
3

e.g. out
5

*/


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
