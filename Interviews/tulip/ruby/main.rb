require 'sinatra'
require 'sqlite3'

# Check version
maj, min = RUBY_VERSION.split('.')
abort 'You need Ruby 2.2 or above.' if (maj.to_i < 2) || (min.to_i < 2)

# Configuration
set :port, 3265

# Check that we can connect to db
db = SQLite3::Database.new "../reports.db"
if db.execute('SELECT count(*) FROM reports').first.first != 20_000
  abort 'Could not connect to sqlite3 database. Please check your ruby/gems setup.'
end

get '/test' do
  # CORS
  response['Access-Control-Allow-Methods'] = 'GET'
  response['Access-Control-Allow-Origin'] = '*'

  content_type :json
  { ok: true }.to_json
end

# respond to OPTIONS for cors
options '/test' do
  response['Access-Control-Allow-Methods'] = 'GET'
  response['Access-Control-Allow-Origin'] = '*'

  204
end
