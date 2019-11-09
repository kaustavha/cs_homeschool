/**
 * 
 * Lever onsite coding interview
 * 1st round question with recursive dir api implementation is below
 * some initial code making the dir structure in nodes in js was provided
 * we then had to implement functions, features and helpers as requested by the interviewer
 * Total time: 1hr - intro
 * 
 * 2 non tech rounds - previous projects, career traj etc
 * 
 * Final round! Code review: https://gist.github.com/kaustavha/844d6662c7471a599ddc1cbcf5fac110
 * Heres a pretend coffee script pr - whats wrong with it?
 * 
 * Secret final walkout round:
 * - Hi how was the interview process?
 * - Honestly for an ATS company it was surprisingly bad. 
 * - Got dropped for 3 weeks in the middle with no replies.
 * - Emails from engineers are sent from no-reply emails addresses:
 *   -- Zoom integration failed
 *   -- Had to manually request links
 *   -- Engineer on 2nd call had no idea i was on for a while, replied, realized its no reply, emailed contact, contact pinged him
 * Interviews total:
 * - call: recruiter
 * - call: coderpad code screen
 * - vid: interview about DOM nodes, recursion, linked lists, dfs
 * - vid: previous project discussion with tech lead
 * - onsite: directory question
 * - onsite: product demo - they just show you the product
 * - onsite: career trajectory hr discussion
 * - onsite: code review via remote video chat lol 
 * - 8 
 */

/**
For tests, it's often useful to have in-memory versions of APIs, to make the tests run faster. Here, we'll be implementing an in-memory filesystem API - one that is not backed by "real" files and directories.

Say that the contents of our in-memory filesystem look like this:

- dir1
  - dir2
    - file1
    - file2
  - file3
- dir3
- file4

The starting code creates a file system with the hierarchy above, but feel free to change the way the filesystem is structured to suit your needs. We provide a Directory#add method you can use as is, but the exact API / class structure is up to you.

Then, write a resolve method that works like this:

root.resolve('dir1/dir2');    // dir2
dir2.resolve('..');           // dir1


2nd part 
implement files and `file.*` to return all files

*/

function Directory(name = '') {
    this.name = name;
    this.parent = null;
    this.directories = {};
    this.files = {};
}

Directory.prototype.find = function (name) {
    let isFile = name.match('file')
    let searchExp = new RegExp(name);

    if (isFile !== null) {
        return this.getFiles(searchExp);
    }

    if (this.name.match(searchExp)) return this;

    for (let key in this.directories) {
        let dir = this.directories[key];
        let res = dir.find(name);
        if (res) return res;
    }

    return false;
}

Directory.prototype.getFiles = function (re) {
    let res = [];
    Object.keys(this.files).some(filename => {
        if (filename.match(re)) res.push(this.files[filename])
    })
    Object.keys(this.directories).some(dirname => {
        res = res.concat(this.directories[dirname].getFiles(re))
    })
    return res;
}

Directory.prototype.resolve = function (path) {
    let fileNotFounderr = new Error('File not found');
    let parts = path.split('/');
    let curPart = parts.shift();

    if (curPart === '.') {
        return this;
    }

    // handle parent
    if (curPart === '..') {
        if (!this.parent) return fileNotFounderr;
        return this.parent;
    }

    if (parts.length === 0) {
        if (this.directories[curPart]) return this.directories[curPart];
        if (this.files[curPart]) return this.files[curPart];

        return fileNotFounderr;
    }

    if (this.directories[curPart]) {
        return this.directories[curPart].resolve(parts.join('/'))
    }

    return fileNotFounderr;
}

Directory.prototype.add = function (o) {
    if (o instanceof File) {
        this.files[o.name] = o;
    } else if (o instanceof Directory) {
        this.directories[o.name] = o;
    } else {
        throw new Error('Not a file or directory: ' + o);
    }

    o.parent = this;
}

function File(name) {
    this.name = name;
    this.parent = null;
}

// Creates the structure mentioned in the prompt
var _root = new Directory('');
var dir1 = new Directory('dir1');
_root.add(dir1);

var dir2 = new Directory('dir2');
dir1.add(dir2);

var file1 = new File('file1');
dir2.add(file1);

var file2 = new File('file2');
dir2.add(file2);

var file3 = new File('file3');
dir1.add(file3);

var dir3 = new Directory('dir3');
_root.add(dir3);

var file4 = new File('file4');
_root.add(file4);


// Add test code here

let res = _root.resolve('dir1/dir2')
console.log(res.name)

res = res.resolve('..')
console.log('====')
console.log(res.name)

console.log('====')
res = res.resolve('.')
console.log(res.name)


console.log('====')
res = _root.resolve('dir1/dir2/file1')
console.log(res.name)


console.log('====')
res = _root.resolve('dir1/dir2/../..')
console.log(res)


console.log('====')
res = _root.resolve('dir1/dir2/file10')
console.log(res)


console.log('====')
res = _root.resolve('../../..')
console.log(res)


console.log('====')
res = _root.find('dir2')
console.log(res.name)


console.log('====')
res = _root.find('dir1')
console.log(res.name)


console.log('====')
res = _root.find('file.*')
console.log(res)
