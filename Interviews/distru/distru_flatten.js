/**
 * {
  index: {
    about: {
      team: true,
      company: ['Jim', 'Barry']
    }
  }
}



{
  'index/about/team': true,
  'index/about/company': ['Jim', 'Barry']
}

 */


function flatten(obj, incomingKey) {
    let res = {};
    let curKey, resVal ={};
    for (let key in obj) {
        if (incomingKey) {
            curKey = `${incomingKey}/${key}`
        } else {
            curKey = `${key}`
        }
        let val = obj[key];
        // let resVal;
        if (val instanceof Object && !Array.isArray(val)) {
            Object.assign(resVal, flatten(val, curKey));
        } else {
            Object.assign(resVal, {[curKey]: val})
        }
        // return resVal;
    }
    return resVal;
}

// console.log(flatten({index: 1}))
// console.log(flatten({index: {about: 1}}))
console.log(flatten({index: 
    {
        about: {
    team: true,
    company: ['jim', 'barry']
    },
        foo: 'bar'
}}))