require 'sinatra'
require 'json'
require 'sqlite3'


set :port, 3265
db = SQLite3::Database.new "../reports.db"

# Helpers

# sums an array of numbers
def sum(array)
  array.reduce(0, :+)
end

# given an array of hashes with a :memory property, returns the average value
def average_memory(datapoints)
  return 0 if datapoints.empty?
  sum(datapoints.map { |point| point[:memory] }) / datapoints.length
end

# given a number of milliseconds as a string, parses it and returns a number
# of seconds
MILLISECONDS_IN_SECOND = 1000
def parse_millisecond_string_into_seconds(milliseconds_string)
  if milliseconds_string.nil?
    nil
  else
    milliseconds_string.to_i / MILLISECONDS_IN_SECOND
  end
end

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

get '/data' do
  # CORS
  response['Access-Control-Allow-Methods'] = 'GET'
  response['Access-Control-Allow-Origin'] = '*'

  # Params take milliseconds, db is in seconds, so we'll need to convert
  start_time = parse_millisecond_string_into_seconds(params[:startTime])
  end_time = parse_millisecond_string_into_seconds(params[:endTime])
  pages = params[:pages] && params[:pages].split(',')

  # Pull data from DB
  filtered_data = []
  db.execute('SELECT timestamp, bytes_used, did_aww_snap, current_page FROM reports').each do |row|
    timestamp, bytes_used, did_aww_snap, current_page = row
    if (
      (start_time.nil? || (timestamp >= start_time)) &&
      (end_time.nil? || (timestamp <= end_time)) &&
      (pages.nil? || pages.include?(current_page))
    )
      filtered_data.push(
        time: timestamp * MILLISECONDS_IN_SECOND,
        memory: bytes_used,
        didCrash: did_aww_snap == 1,
        page: current_page
      )
    end
  end

  crashed_data = filtered_data.select { |row| row[:didCrash] }

  content_type :json
  {
    stats: {
      totalReadings: filtered_data.length,
      totalCrashes: crashed_data.length,
      averageMemory: average_memory(filtered_data),
      averageMemoryAtCrash: average_memory(crashed_data)
    },
    points: filtered_data
  }.to_json
end

# respond to OPTIONS for cors
options '/data' do
  response['Access-Control-Allow-Methods'] = 'GET'
  response['Access-Control-Allow-Origin'] = '*'

  204
end
