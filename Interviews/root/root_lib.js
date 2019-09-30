const driverKey = 'Driver';
const tripKey = 'Trip';

class Metric {
    constructor(driver='', distance=0.0, avgSpd=0.0) {
        this.driver = driver;
        this.distance = distance;
        this.avgSpd = avgSpd;
    }
    update(distance=0.0, avgSpd=0.0) {
        let newTotalDist = this.distance + distance,
            newAvgSpd = this.avgSpd > 0 ? (this.avgSpd*this.distance) + (avgSpd*distance) / newTotalDist : avgSpd;
        this.distance = newTotalDist;
        this.avgSpd = newAvgSpd;
    }
}

class DrivingHistory {
    constructor() {
        this.driverKey = driverKey;
        this.tripKey = tripKey;
        this.history = {};
        this.report = '';
    }

    process(rawText='') {
        let components = rawText.trim().split(' ');
        if (components.length === 2 && components[0] == this.driverKey) {
            this.addDriver(components[1]);
        } else if (components.length === 5 && components[0] == this.tripKey) {
            this.addTrip(components[1],
                        parseInt(components[2].split(':').join('')),
                        parseInt(components[3].split(':').join('')),
                        parseFloat(components[4]));
        }
    }

    addDriver(driver='') {
        if (this.history[driver]) return console.log(new Error("Error: Driver already exists"));
        this.history[driver] = new Metric(driver);
    }

    addTrip(driver='', start=0, end=0, distance=0.0) {
        if (!(this.history[driver])) return console.log(new Error("Error: Driver doesnt exist"));
        let avgSpd = this._calculateAverageSpeed(start, end, distance);
        if (avgSpd < 5 || avgSpd > 100) return; // Discard any trips that average a speed of less than 5 mph or greater than 100 mph.
        this.history[driver].update(distance, avgSpd);
    }

    _calculateAverageSpeed(start=0, end=0, miles=0.0) {
        return miles*100/(end-start);
    }

    generateReport() {
        this.report = '';
        let histArr = [];
        for (let key in this.history) {
            histArr.push(this.history[key]);
        }
        histArr.sort((a, b) => {
            return b.distance - a.distance;
        });
        histArr.forEach(history => {
            let str = '';
            str += `${history.driver}: ${parseInt(history.distance)} miles`;
            str += history.distance > 0 && history.avgSpd > 0 ? ` @ ${parseInt(history.avgSpd)} mph` : '';
            this.report += str + '\n';
        });
    }

    printReport() {
        console.log(this.report);
    }
}

module.exports = {
    DrivingHistory: DrivingHistory,
    Metric: Metric
}
