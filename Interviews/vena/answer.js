const fs = require('fs');
const path = require('path');
var obj = {};
var idList=[];
const jsonpath = './2016-06-20';
const trackMe = 7781697;
var approxTotal = 0;
var out = {
    "total_kilometers": 0,
    "plane_kms": {
    }
}

function updateOutput(id, dist) {
    out.total_kilometers += dist;
    if (id == trackMe) {
        out.plane_kms[id] += dist;
    }
}

function debug() {
    console.log(obj.length);
}

function haversine([lat1,lon1], [lat2,lon2]){
    // console.log('haversin', [lat1,lon1,lat2,lon2]); 
    let radius = 6372.8, //km

    // get deg in radians
    [rlat1, rlat2, rlon1, rlon2] = [lat1, lat2, lon1, lon2]
    .map((x)=>{return x/180 * Math.PI}),

    dlat = rlat2 - rlat1,
    dlon = rlon2 - rlon1,
    
    x = Math.sin(dlat/2),
    a = Math.sin(dlat/2)*Math.sin(dlat/2)+Math.sin(dlon/2)*Math.sin(dlon/2) * Math.cos(lat1) * Math.cos(lat2);

    // console.log("rlat, ", rlat1, rlat2, rlon1,rlon2);
    // console.log('dlat',dlat, dlon);
    // // console.log(radius, sin);
    // console.log(a,dlat);


    return Math.round(
        radius * 2 * Math.asin(
            Math.sqrt(
                Math.pow(Math.sin(dlat/2),2) +
                Math.pow(Math.sin(dlon/2), 2) *
                Math.cos(rlat1) * Math.cos(rlat2)
            )
        ) * 100
    ) /100

};

// var ci = 0;
// fs.readdir('./2016-06-20', (err, files)=>{
//     files.forEach((f,i)=>{
//         ci++;
//         // console.log(f);
//         fs.readFile('./2016-06-20/'+f, (err, dat)=>{
//             if (err) throw err;
//             let datJson = JSON.parse(dat);
//             // console.log(dat);
//             // console.log(datJson.acList.length);
//             datJson.acList.forEach((ele,i)=>{
//                 obj[ele.id] = true;
//                 idList.push(ele.id);
//             });
//             c--;
//         });
//         if (ci==0) console.log(idList.length);
//     });
// // });
// {"Id":11368446,"Rcvr":1,"HasSig":true,"Sig":16,"Icao":"AD77FE","Bad":false,"Reg":"N967UW","FSeen":"\/Date(1466465546520)\/","TSecs":3,"CMsgs":2,"Alt":800,"GAlt":800,"AltT":0,"Tisb":false,"TrkH":false,"Type":"E190","Mdl":"2008 EMBRAER ERJ 190-100 IGW","Man":"Embraer","CNum":"19000211","Op":"US AIRWAYS INC     - FORT WORTH, TX","OpIcao":"AAL","Sqk":"","VsiT":0,"WTC":2,"Species":1,"Engines":"2","EngType":3,"EngMount":0,"Mil":false,"Cou":"United States","HasPic":false,"Interested":false,"FlightsCount":0,"Gnd":false,"SpdTyp":0,"CallSus":false,"TT":"a","Trt":1,"Year":"2008"}
// console.log(obj);

function run(){
let files = fs.readdirSync(jsonpath);
// console.log(files);
let counter = 0;
for (var i = 0; i < files.length; i++) {
    let curPath = path.join(jsonpath,files[i]),
        dat = fs.readFileSync(curPath),
        datJson = JSON.parse(dat),
        acList = datJson.acList;
    
    acList.forEach(function(ele,i) {
        if (ele.Lat !== undefined && ele.Long !== undefined) {
            let id = ele.Id;
            // console.log(ele.Long);
            // console.log(ele.Lat);
            // console.log(ele.Lat, ele.Long);
            if (obj[id] == undefined) {
                // console.log(ele.id);
                obj[id] = {
                    // 'total':0,
                    'lastLoc':{
                        'Lat':ele.Lat,
                        'Long':ele.Long
                    }
                }
            } else {
                let thisPlane = obj[id];
                // calc haversine and update lastloc
                let hdist = haversine([
                    thisPlane.lastLoc.Lat,
                    thisPlane.lastLoc.Long
                ], [
                    ele.Lat,
                    ele.Long
                ]);
                thisPlane.lastLoc.Lat = ele.Lat;
                thisPlane.lastLoc.Long = ele.Long;
                // thisPlane.total += parseFloat(hdist);
                updateOutput(id, parseFloat(hdist));
            }
            // if 
            // obj[ele.id] = true;
            // idList.push(ele.id);
            // this.counter++;
        }
    }, this);
    // if (counter % 100 == 0) console.log(idList.length);
}
}

run();
console.log(out);
fs.writeFileSync('out.json', out);
// fs.appendFileSync("./out.txt", out);
// console.log(out);

// console.log(haversine([36.12, -86.67], [33.94, -118.40]));
// console.log(idList.length);