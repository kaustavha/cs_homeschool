const express = require('express')
const sqlite3 = require('sqlite3')
const cors = require('cors')

const app = express()

app.use(cors())

const db = new sqlite3.Database('../reports.db');

const MILLISECONDS_IN_SECOND = 1000;

// sums an array of numbers
function sum(array) {
  return array.reduce((sum, value) => sum + value, 0);
}

// given an array of objects with a "memor" property, returns the average value
function averageMemory(datapoints) {
  return sum(datapoints.map(point => point.memory)) / datapoints.length;
}

// given a number of milliseconds as a string, parses it and returns a number
// of seconds
function parseMillisecondStringIntoSeconds(millisecondsString) {
  if (millisecondsString == null) {
    return null;
  }

  return parseInt(millisecondsString) / MILLISECONDS_IN_SECOND;
}

/*
GET /data

Url params:
  startTime: milliseconds since the epoch. Optional.
  endTime: milliseconds since the epoch. Optional.
  pages: comma-separated list of pages. Optional.

Returns as JSON:
{
  "stats": {
    "totalReadings": <Number, total number of filtered data points>,
    "totalCrashes": <Number, number of crashes in the filtered set>,
    "averageMemory": <Number, average memory used in the filtered set>,
    "averageMemoryAtCrash": <Number, average memory used in the filtered set at crash>
  },
  "points": [{
    "time": <Number, milliseconds since epoch>,
    "memory": <Number, bytes>,
    "didCrash": <Boolean>,
    "page": <String>
  }]
}
*/
app.get('/data', (req, res) => {
  const {
    startTime: startTimeMillis,
    endTime: endTimeMillis,
    pages: pagesStr,
  } = req.query;

  // Params take milliseconds, db is in seconds, so we'll need to convert
  const startTime = parseMillisecondStringIntoSeconds(startTimeMillis);
  const endTime = parseMillisecondStringIntoSeconds(endTimeMillis);
  const pages = pagesStr ? pagesStr.split(',') : null;
  let pagesSearchStr = '';

  if (pages) {
    if (pages.length > 1) {
      pagesSearchStr = ' WHERE current_page IS "';
      pagesSearchStr += pages.join('" OR current_page IS "');
      pagesSearchStr += '"';
      // pagesSearchStr = ' WHERE current_page IS ("' + pages.join('" OR "') + '")';
    } else if (pages.length == 1) {
      pagesSearchStr = ' WHERE current_page IS "' + pages[0] + '"';
    }
  }

  // console.log(pagesSearchStr);

  // Pull all data from the DB
  db.all('SELECT * FROM reports' + pagesSearchStr, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: true });
      return;
    }

    // Filter out rows that are outside of the timerange or not in the pages
    // then map them to have the desired fields for the output
    const data = rows.filter(row => {
      return ((startTime == null) || (row.timestamp >= startTime))
        && ((endTime == null) || (row.timestamp <= endTime))
        && ((pages == null) || (pages.includes(row.current_page)));
    }).map(row => ({
      time: row.timestamp * MILLISECONDS_IN_SECOND,
      memory: row.bytes_used,
      didCrash: (row.did_aww_snap === 1),
      page: row.current_page,
    }));


    for (var i = 0; i < data.length; i++) {
      let thisPoint = data[i];
      if (thisPoint.didCrash) {
        thisPoint.didCrash = false;
        data[i-1].didCrash = true;
      }
    }

    // pull out just the crashing data points
    const crashedData = data.filter(row => row.didCrash);


    res.json({
      stats: {
        totalReadings: data.length,
        totalCrashes: crashedData.length,
        averageMemory: averageMemory(data),
        averageMemoryAtCrash: averageMemory(crashedData),
      },
      points: data,
    });
  });
})

app.listen(3265, () => {
  console.log('App listening on port 3265');
});
