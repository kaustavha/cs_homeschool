CONTEXT
=======

Tulip Factory frequently runs 24/7, either looking at visualizations or when acting as a player. This constant usage means that memory leaks are serious issues, and we've built some tools to track them down.

One time, when dealing with a hard-to-find memory leak, we added some code to our website that would make perodic requests to a webserver with memory usage, the current URL, and if the page had crashed. We then made a small webapp to show off that data that allowed us to find the crash.

For this assignment, we've taken that webapp and introduced some bugs into it. Throughout the interview you'll be updating the code to fix those bugs.

RESOURCES
=========

## Webapp

The frontend of the webapp is in frontend. To run it, open frontend/index.html in Google Chrome. It uses Plotly to render the graphs.

The backend of the webapp has three versions: one in NodeJS using Express, one in Ruby using Sinatra, and one in Python using Flask. You can work with whichever one you prefer. Follow the instructions in backend-nodejs or backend-ruby to start it up.

## Sqlite3 Database

We've created a database containing 20,000 datapoints. You can find the database file (reports.db) in the root folder.

The schema for the database is:

```sql
CREATE TABLE reports (
    id SERIAL,
    timestamp integer NOT NULL,
    bytes_used integer NOT NULL,
    current_page varchar(255) NOT NULL,
    did_aww_snap boolean NOT NULL
);
```

Some sample data from the table:
```
memory_tracker=> select * from reports limit 10;
 id | timestamp  | bytes_used | current_page | did_aww_snap
----+------------+------------+--------------+--------------
  1 | 1443733964 |  117729299 | /processes   | 0
  2 | 1443733969 |  119474910 | /processes   | 1
  3 | 1443733974 |  121074824 | /processes   | 0
  4 | 1443733979 |  124724906 | /processes   | 0
  5 | 1443733984 |  126436945 | /processes   | 0
  6 | 1443733989 |  127649558 | /processes   | 0
  7 | 1443733994 |  130318543 | /processes   | 0
  8 | 1443733999 |  132935857 | /processes   | 0
  9 | 1443734004 |  137633446 | /processes   | 0
 10 | 1443734009 |  138414970 | /processes   | 1
