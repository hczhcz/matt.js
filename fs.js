'use strict';

var Node = function (mode, owner) {
    this._mode = mode;
    this._owner = owner;
};

Node.prototype.

Node.prototype.getattr = function (cb) {
    cb(this._mode, this._owner);
};

Node.prototype.chmod = function (mode, cb) {
    this._mode = mode;
    cb();
};

Node.prototype.chown = function (owner, cb) {
    this._owner = owner;
    cb();
};

var Dir = function (mode, owner) {
    Node.call(this, mode, owner);
    this._list = [];
};
Dir.prototype = new Node();

Dir.prototype.readdir = function (cb) {
    cb(this._list);
};

Dir.prototype.create = function (node, cb) {
    this._list
};

// TODO
// create
// link
// lock
// mkdir
// open
// opendir
// read
// readdir
// readlink
// rename
// rmdir
// statfs
// symlink
// truncate
// unlink
// write
