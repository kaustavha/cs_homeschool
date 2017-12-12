from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

conn = sqlite3.connect('../reports.db')

# Helpers

# given an array of dictionaries with a "memory" key, returns the average value
def average_memory(datapoints):
    if len(datapoints) == 0:
        return 0

    return sum([point["memory"] for point in datapoints]) / len(datapoints)

# given a number of milliseconds as a string, parses it and returns a number
# of seconds
MILLISECONDS_IN_SECOND = 1000
def parse_millisecond_string_into_seconds(milliseconds_string):
  if milliseconds_string == None:
    return None
  else:
    return int(milliseconds_string) / MILLISECONDS_IN_SECOND


# GET /data

# Url params:
#   startTime: milliseconds since the epoch. Optional.
#   endTime: milliseconds since the epoch. Optional.
#   pages: comma-separated list of pages. Optional.

# Returns as JSON:
# {
#   "stats": {
#     "totalReadings": <Number, total number of filtered data points>,
#     "totalCrashes": <Number, number of crashes in the filtered set>,
#     "averageMemory": <Number, average memory used in the filtered set>,
#     "averageMemoryAtCrash": <Number, average memory used in the filtered set at crash>
#   },
#   "points": [{
#     "time": <Number, milliseconds since epoch>,
#     "memory": <Number, bytes>,
#     "didCrash": <Boolean>,
#     "page": <String>
#   }]
# }

@app.route("/data")
def data():
    start_time_str = request.args.get("startTime", None)
    end_time_str = request.args.get("endTime", None)
    pages_str = request.args.get("pages", None)

    # Params take milliseconds, db is in seconds, so we'll need to convert
    start_time = parse_millisecond_string_into_seconds(start_time_str)
    end_time = parse_millisecond_string_into_seconds(end_time_str)
    pages = pages_str and pages_str.split(",")

    # Pull data from DB
    filtered_data = []
    curs = conn.cursor()
    for row in curs.execute("SELECT timestamp, bytes_used, did_aww_snap, current_page FROM reports"):
        row_timestamp, row_bytes_used, row_did_aww_snap, row_current_page = row

        if (
            ((start_time == None) or (row_timestamp >= start_time)) and
            ((end_time == None) or (row_timestamp <= end_time)) and
            ((pages == None) or (row_current_page in pages))
        ):
            filtered_data.append({
                "time": row_timestamp * MILLISECONDS_IN_SECOND,
                "memory": row_bytes_used,
                "didCrash": (row_did_aww_snap == 1),
                "page": row_current_page
            })

    crashed_data = [data for data in filtered_data if data["didCrash"]]

    return jsonify({
        "stats": {
            "totalReadings": len(filtered_data),
            "totalCrashes": len(crashed_data),
            "averageMemory": average_memory(filtered_data),
            "averageMemoryAtCrash": average_memory(crashed_data)
        },
        "points": filtered_data
    })


if __name__=="__main__":
    app.run("127.0.0.1", 3265)
