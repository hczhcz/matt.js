'use strict';

import {ErrFunc, EmptyFunc, TypedFunc} from './func';
import {Context} from './context';

// mountings:
//     /etc/passwd: user system

export interface ModeFunc extends TypedFunc {
    (context: Context, callback: EmptyFunc, fail: ErrFunc): void;
};
export interface OwnerFunc {
    (context: Context, callback: (user: string) => void): void;
};

export interface Node {
    read: ModeFunc;
    write: ModeFunc;
    exec: ModeFunc;
    owner: OwnerFunc;
};

// Node.prototype.getattr = function (context, callback, fail) {
//     this._read(context, function () {
//         callback(context, this._mode, this._owner);
//     }, fail);
// };

// Node.prototype.chmod = function (mode, callback) {
//     this._mode = mode;
//     callback();
// };

// Node.prototype.chown = function (owner, callback) {
//     this._owner = owner;
//     callback();
// };

export interface Dir extends Node {
    // list: // TODO
};

// Dir.prototype.readdir = function (callback) {
//     callback(this._list);
// };

// Dir.prototype.create = function (node, callback) {
//     this._list
// };

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
