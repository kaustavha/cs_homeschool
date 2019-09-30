
const driverKey = 'Driver';
const tripKey = 'Trip';
const DrivingHistory = require('./root_lib').DrivingHistory;

const { execSync } = require('child_process');

function TestDrivingHistory(driverName, tripDetails, expectedOut) {
    let DH = new DrivingHistory();
    DH.process(`${driverKey} ${driverName}`);
    DH.process((`${tripKey} ${driverName} ${tripDetails}`));
    DH.generateReport();
    if (DH.report.trim() != expectedOut) {
        console.log(`Test Err: Expected: {${expectedOut}} Actual: {${DH.report}}`);
    } else {
        console.log(`Test Passed: Expected: ${expectedOut} Actual: ${DH.report}`)
    }
}

function RunTests() {
    TestDrivingHistory('Dan', '06:12 06:32 21.8', 'Dan: 0 miles'); // Too fast
    TestDrivingHistory('Bob', '00:00 00:00 00.0', 'Bob: 0 miles'); // 0s
    TestDrivingHistory('Bob', '01:00 02:00 4', 'Bob: 0 miles'); // Too slow
    TestDrivingHistory('Bob', '01:00 02:00 40', 'Bob: 40 miles @ 40 mph');

    // Manual Test
    let DH = new DrivingHistory();
    `Driver Dan
    Driver Lauren
    Driver Kumi
    Driver Bob
    Trip Dan 07:15 07:45 17.3
    Trip Dan 06:12 06:32 21.8
    Trip Lauren 12:01 13:16 42.0
    Trip Bob 07:15 07:45 7.3
    Trip Bob 07:15 07:45 107.3`.split('\n').forEach(line => {
        DH.process(line);
    });

    let child = execSync('node root_cli.js mock_data.txt', { encoding : 'utf8' });
    DH.generateReport();

    let cmp = DH.report.length === child.length-1;
    if (cmp) {
        console.log("Test pass - cli check with default data");
    } else {
        console.log('test fail', DH.report, child, child.length, DH.report.length)
    }
}

RunTests();