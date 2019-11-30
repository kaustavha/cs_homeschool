const input = require('./units_small.json');

class UnitManager {
    constructor(units) {
        this.units = units;
    }

    add_unit(unit) {
        this.units.push(unit);
    }

    nearest_similar_units(unit={}, limit=0) {
        let set = [];

        this.units.forEach(incomingUnit => {
            let totalSim = this._calcSim(unit, incomingUnit);

            let dist = this._getDist(unit, incomingUnit);
            set.push({[incomingUnit.id] : dist + totalSim})
        });


        set.sort((a,b) => {
            return Object.values(a)[0] - Object.values(b)[0];
        });


        let ids = set.slice(0, limit+1)

        let res = {};
        ids.forEach(id => {
            res[Object.keys(id)[0]] = true;
        })

        console.log(Object.keys(res))

        let filtered =  this.units.filter(unit => {
            if (Object.keys(res).indexOf(unit.id+'') > -1) return unit;
        })

        console.log(filtered)

        // return set.slice(0, limit+1);
    }

    _getDist(unit1, unit2) {
        // euclid
        let lat1 = parseFloat(unit1.lat),
            lon1 = parseFloat(unit1.lng),
            lat2 = parseFloat(unit2.lat),
            lon2 = parseFloat(unit2.lng);
        let squaredRes =  Math.pow((lat1 - lat2), 2)+Math.pow((lon1 - lon2), 2);

            // console.log(1, lon1, lon2, )

            return Math.sqrt(squaredRes);
    }

    _calcSim(unit1, unit2) {
        let totalSim = 3;

        const sim = (key) => unit1[key] === unit2[key] ? totalSim-- : 0;

        if (unit1.id === unit2.id) return totalSim;

        sim("baths")
        sim("beds")
        sim("has_elevator")
        return totalSim;
    }
}

let um = new UnitManager(input);


console.log(um.nearest_similar_units(input[7000], 5))