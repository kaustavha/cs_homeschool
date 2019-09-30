const fs = require('fs');
const myArgs = process.argv.slice(2);

const DrivingHistory = require('./root_lib').DrivingHistory;

function RunMain(myArgs) {
    let fileBuffer = myArgs.length > 0 ? fs.readFileSync(myArgs[0], 'utf8') : '';
    let DH = new DrivingHistory();
    fileBuffer.split('\n').forEach(line => DH.process(line))
    DH.generateReport();
    DH.printReport();
}

RunMain(myArgs);
