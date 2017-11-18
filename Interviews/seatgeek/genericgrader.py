import subprocess
from subprocess import PIPE
import os
import json
import argparse
import shlex

def _section_match(s1, s2):
    return s1 == s2 or (s1 is None and s2 is None)

def _row_match(r1, r2):
    return r1 == r2 or (r1 is None and r2 is None)

def grade_match(match, verbose=False):
    e_sid, e_rid, e_valid = match["expected"]["section_id"], match["expected"]["row_id"], match["expected"]["valid"]
    o_sid, o_rid, o_valid = match["output"]["section_id"], match["output"]["row_id"], match["output"]["valid"]
    i_s = match["input"]["section"]
    i_r = match["input"]["row"]

    # if expected is valid...
    sm = _section_match(e_sid, o_sid)
    rm = _row_match(e_rid, o_rid)
    vm = e_valid == o_valid
    pts = 0

    if e_valid:
        if sm and rm and vm:
            if verbose:
                print ".. ok"
            pts = 1

        if not vm:
            if verbose:
                print ".. {}:{} marked invalid, should be {}:{}".format(i_s, i_r, e_sid, e_rid)
            pts = 0

        if vm and (not sm or not rm):
            if verbose:
                print ".. {}:{} WRONG!, marked {}:{}, should be {}:{}".format(i_s, i_r, o_sid, o_rid, e_sid, e_rid)
            pts = -5

    if not e_valid:
        if not o_valid:
            if verbose:
                print ".. ok"
            pts = 1

        else:
            if verbose:
                print ".. {}:{} WRONG! Marked valid, should be invalid".format(i_s, i_r)
            pts = -5
    return pts

def parse_output(k):
    stdout_output = k[0]
    stderr_output = k[1]

    lines = stdout_output.splitlines()
    valid_lines = []
    for line in lines:
        try:
            data = json.loads(line.strip())
            if 'expected' in data and 'output' in data and 'input' in data:
                valid_lines.append(data)
        except:
            pass
    return valid_lines

def grade(path_to_manifest, path_to_input, path_to_executable, verbose=False):
    _manifest = os.path.abspath(path_to_manifest)
    _input = os.path.abspath(path_to_input)
    _executable = os.path.abspath(path_to_executable)

    cmd = "{} --manifest {} --input {}".format(_executable, _manifest, _input)
    args = shlex.split(cmd)
    p = subprocess.Popen(args, stdout=PIPE, stderr=PIPE)
    k = p.communicate()
    valid_lines = parse_output(k)

    total_pts = 0
    max_pts = 0
    for match in valid_lines:
        pts = grade_match(match, verbose=verbose)
        max_pts += 1
        total_pts += pts

    print "{} / {}".format(total_pts, max_pts)
    return total_pts, max_pts

def grade_python(path_to_manifest, path_to_input, verbose=False):
    executable = "python/normalize"
    grade(path_to_manifest, path_to_input, executable, verbose=verbose)

def grade_ruby(path_to_manifest, path_to_input, verbose=False):
    executable = "ruby/normalize"
    grade(path_to_manifest, path_to_input, executable, verbose=verbose)

def grade_java(path_to_manifest, path_to_input, verbose=False):
    executable = "java/normalize"
    grade(path_to_manifest, path_to_input, executable, verbose=verbose)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='grader for seatgeek SectionNormalization code test')
    parser.add_argument('--manifest', default=None, help='path to manifest file')
    parser.add_argument('--input', default=None, help='path to input file')
    parser.add_argument('--lang', default='python')
    parser.add_argument('--verbose', action='store_true', default=False)

    args = parser.parse_args()

    assert args.lang in ('python', 'ruby', 'java')
    assert args.manifest and args.input

    if args.lang == 'python':
        grade_python(args.manifest, args.input, args.verbose)

    if args.lang == 'ruby':
        grade_ruby(args.manifest, args.input, args.verbose)

    if args.lang == 'java':
        grade_java(args.manifest, args.input, args.verbose)
