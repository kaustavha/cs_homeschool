import argparse
from normalizer import Normalizer
import csv
import json

def tobool(s):
    """helper method to parse bools"""
    try:
        int_s = int(s)
        return bool(int_s)
    except:
        pass
    if s.lower()[0] == "t":
        return True
    elif s.lower()[0] == "f":
        return False
    else:
        raise ValueError("cannot find bool")

def toint(s):
    try:
        return int(s)
    except:
        if not s:
            return None
        raise ValueError("cannot convert to int")

def read_input(input_path):
    samples = []
    with open(input_path, 'rU') as f:
        reader = csv.DictReader(f)
        for row in reader:
            sample = {
                "input" : {"section" : row["section"], "row" : row["row"]},
                "expected" : {"section_id" : toint(row["n_section_id"]), "row_id" : toint(row["n_row_id"]), "valid" : tobool(row["valid"])}
            }
            samples.append(sample)
    return samples

def normalize_samples(normalizer, samples, verbose=False):
    matched = []
    for sample in samples:
        sid, rid, valid = normalizer.normalize(sample["input"]["section"], sample["input"]["row"])
        sample["output"] = {"section_id" : sid, "row_id" : rid, "valid" : valid}
        matched.append(sample)
    return matched

def output_samples(matched):
    """print this to the command line in json format
    the grading script will """
    for match in matched:
        print json.dumps(match)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='grader for seatgeek SectionNormalization code test')
    parser.add_argument('--manifest', default=None, help='path to manifest file')
    parser.add_argument('--input', default=None, help='path to input file')
    parser.add_argument('--section', default=None, help='section input (for testing)')
    parser.add_argument('--row', default=None, help='row input (for testing)')

    args = parser.parse_args()

    assert args.manifest

    normalizer = Normalizer()
    normalizer.read_manifest(args.manifest)

    if args.section and args.row:
        section_id, row_id, valid = normalizer.normalize(args.section, args.row)
        print """
        Input:
            [section] {}\t[row] {}
        Output:
            [section_id] {}\t[row_id] {}
        Valid?:
            {}
        """.format(args.section, args.row, section_id, row_id, valid)

    elif args.input:
        samples = read_input(args.input)
        matched = normalize_samples(normalizer, samples, verbose=False)
        output_samples(matched)

