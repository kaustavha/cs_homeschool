require 'csv'
require 'json'
require 'optparse'
require './normalizer.rb'

# helper method to turn a string to a boolean
# understanding proper semantic value of the string
def to_boolean(s)
  s and !!s.match(/^(true|t|yes|y|1)$/i)
end

# helper method to turn a string to an int
# or nil (if not correctly formed)
def int_or_nil(s)
  Integer(s || '')
rescue ArgumentError
  nil
end

def read_input(input_path)
  samples = []
  CSV.foreach(input_path, headers: true) do |row|
    sample = {
      input: {section: row["section"], row: row["row"]},
      expected: {section_id: int_or_nil(row["n_section_id"]), row_id: int_or_nil(row["n_row_id"]), valid: to_boolean(row["valid"])}
    }
    samples << sample
  end
  samples
end

def normalize_samples(normalizer, samples, verbose=false)
  matched = samples.map do |sample|
    vals = normalizer.normalize(sample[:input][:section], sample[:input][:row])
    sid = vals[0]
    rid = vals[1]
    valid = vals[2]
    sample[:output] = {:section_id => int_or_nil(sid), :row_id => int_or_nil(rid), :valid => to_boolean(valid)}
    sample
  end
  matched
end

def output_samples(matched)
  matched.each do |match|
    puts JSON.dump(match)
  end
end

def main()
  options = {}
  OptionParser.new do |opts|
    opts.banner = "Usage: normalize.rb [options]"

    opts.on('-mMANIFEST', '--manifest=MANIFEST', "path to manifest file") { |m| options[:manifest] = m }
    opts.on('-iINPUT', '--input=INPUT', "path to input file") { |i| options[:input] = i }
    opts.on('-sSECTION', '--section=SECTION', "section input (for testing)") { |s| options[:section] = s }
    opts.on('-rROW', '--row=ROW', "row input (for testing)") { |r| options[:row] = r }

  end.parse!
  puts options

  normalizer = Normalizer.new
  normalizer.read_manifest(options[:manifest])

  if options[:input]
    samples = read_input(options[:input])
    matched = normalize_samples(normalizer, samples, true)
    output_samples(matched)
  elsif options[:section] and options[:row]
    result = normalizer.normalize(options[:section], options[:row])
    s = "Input:\n    [section] #{options[:section]}\t[row] #{options[:row]}\nOutput:\n    [section_id] #{result[0]}\t[row_id] #{result[1]}\nValid?:\n    #{result[2]}"
    puts s
  end

end

# run main
main()
