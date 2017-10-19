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

var i = 0, rs = 670, stopPropogation=false;
function apply() {
  var rsa = 4000 + (rs*Math.random());
 var interested = "Hi, I’m a new UWaterloo grad and self taught programmer. I have experience working on full-stack web, mobile, devops, SOA, data-science/visualization & blockchain. At my last internship I also had a chance to drive product decisions, onboard new developers, resolve developer disputes, help manage a conference, publish docs & a blog post. I’ve also been a co-founder at a music industry startup which was featured on Dragons Den, Logistics Director for a large (~1000 people) hackathon and presented projects at 5 hackathons. Please see my resume at bit.ly/khaldarcv or via kaustav.me & reach out if I’d be a fit.";
  if ($(".add-note-button > a.g-button.blue:visible").length == 0) {
    $(".browse_startups_table_row:visible").first().click();
  }
  $(".add-note-button > a.g-button.blue:visible").first().click();
  $(".interested-note:visible").first().val(interested);
  $("a.g-button.blue.interested-with-note-button:visible").first().click();
  $(".js-done").click();
  $("html, body").animate({ scrollTop: $(document).height()-$(window).height() });
  i++;
  if (i % 10 == 0) {console.log(i);}
  if (!stopPropogation) {
      setTimeout(apply, rsa);
  } else {
    console.log('stopping propagation');
  }
}

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
