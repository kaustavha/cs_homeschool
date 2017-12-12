// check version
const version = process.versions.node;
const [majorStr, minorStr, __] = version.split('.');
const major = parseInt(majorStr);
const minor = parseInt(minorStr);

if (major <= 5 || (major === 6 && minor < 5)) {
  throw new Error('Must be using Node 6.5 or greater.');
}

// make sure we can require express
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.get('/test', (req, res) => res.json({ ok: true }));

app.listen(3265, () => {
  // try the postgres connection
  const sqlite3 = require('sqlite3')
  const db = new sqlite3.Database('../reports.db');
  db.all('SELECT count(*) as count FROM reports', (err, res) => {
    if (err) {
      throw new Error(err);
      process.exit();
    }

    if (res[0].count !== 20000) {
      throw new Error('Could not connect to sqlite3 database. Please check the sqlite3 library.');
      process.exit();
    }

    console.log('Backend is working. Please open index.html in your browser.');
  });
});
