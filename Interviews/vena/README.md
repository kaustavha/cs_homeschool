In this directory is 2016-06-20.zip which contains historial ADSB data
for that day as a collection of JSON documents:

    Essentially, this is a JSON of all aircraft, with “short trails”
    activated. The short trail duration used in the historical data archive
    is 65 seconds.  This gives all the current information on the aircraft,
    plus any known positions, altitudes and timestamps for the previous
    65 seconds.  Since this query is issued every 60 seconds, all known
    positions should be captured in the data. Please consult this page
    for an explanation of data field contents.
    
    This file is captured every 60 seconds, typically on the 30-second
    mark of any given minute. This generates 1,440 files daily, which
    then get zipped into a single archive per day.  The archive for the
    previous day is typically available by 0100Z (01:00 UTC) the
    following day. Data is available beginning on June 9, 2016. Daily
    files are currently in the neighborhood of 7.9 GB each. Transfer
    rates may be somewhat limited depending on the latency of your
    connection.

Basically, each JSON document is a snapshot of all planes that the
service is tracking, either on the ground or in the sky.

Given the 2016-06-20.zip dataset, answer the following questions:

1. What is the approximate total number of kilometers travelled by the
   plane with the id 7781697?

2. What is the approximate total number of kilometers travelled by all
   planes?

Bonus question:

3. What is the closest two planes come to each other (in km)?

Notes:

Use the Haversine formula.

Use the Lat and Long key values in all computations.

The output format for 1 and 2 should look like:

    {
        "total_kilometers": value,
        "plane_kms": {
            plane_id: value
        }
    }

If you choose to do #3, just print "closest is id X and id Y at N.NN km".

Consult the following sites for documentation:

- https://www.adsbexchange.com/data/
- http://www.virtualradarserver.co.uk/Documentation/Formats/AircraftList.aspx

