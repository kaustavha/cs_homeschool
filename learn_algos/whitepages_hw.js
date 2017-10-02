// DUNGEOUNEERING
// Youre a hero flying through a dungeon, 0s are dragons, dont 
// land on them, find the shortest way out
// given an arr of numbers, find shortest route out
// numbers provide range, e.g
// you start at i=0
// arr = [1,2,3,0]
// you can move up 1 step
// arr[1] => 2, now you can move twice
// if you choose to move 1 step, you land on 0, illegal move 
// but if you move 1 step, you get 3
// i+3 = out of range there fore you add 'out' to step sequence
// step sequence consists of indexes you choose to use
// answer = 0,1,2,out
// 

var input = "", ans = 'failure', inO={}, len=0, rc=0, reported=false;

var cs = [];



function procIn(inpArr) {
    inpArr.forEach((e, i) => {
        inO[i] = parseInt(e);
    });
    len = inpArr.length;
}

let si = 0;
function fly(range, i, inO) {
    if (cs[si] == undefined || cs[si] == null) {
        cs[si] = [0];
    }

    for (var j=i+range; j>i; j--) {
        if (j >= len) {
            cs[si].push('out');
            si++;
            cs[si] = [0];
            rc--;
            return;
        } else if (inO[j] != 0) {
            if (cs[si].length > 1 && i==0) {
                si++;
                cs[si] = [0];
            }
            cs[si].push(j);
            rc++;
            fly(inO[j], j, inO);
        }
   }
    rc--;
    if (rc<=0) {
        return reportAns();
    }
}

function reportAns() {
    let ans = 'failure';
    if (!reported) {
        if (cs.length > 0) {
            let min = Number.MAX_VALUE;
            for (var i = 0; i < cs.length; i++) {
                let l = cs[i].length;
                if (l < min && cs[i][l-1] == 'out') {
                    min = cs[i].length;
                    ans = cs[i];
                }
            }
            if (ans[ans.length-1] == 'out') {
                ans = ans.join(', ');
            }
        }
        reported = true;
        console.log(ans);
    }
}



// let inp = [0,0,0];
// let inp = [2,0,3,0,0]; //p
// let inp = [1,2,1,2,0,0]; //f
// let inp = [4,0,0,2,0]; //p 0,3,o
// let inp = [3,4,0,1,2]; // 0, 1, o
// let inp = [3,6,0,1,0,2,0] // 0,1,o & 0,3
// let inp = [1,2,3,0,0,0]; // failure
// let inp = [5,6,0,4,2,4,1,0,0,4]; //pass
// let inp = ['k',1,'k']
let inp = 'k';
procIn(inp);
rc++;
fly(inO[0], 0, inO);

