'use strict';

import {ErrFunc, EmptyFunc} from './func';
import {Context} from './context';
import {ModeActions, Mode} from './mode';

// mountings:
//     /etc/passwd: user system

export class Node {
    mode: Mode;

    getattr(
        context: Context,
        callback: (mode: string) => void,
        fail: ErrFunc
    ) {
        this.mode.check(
            context, ModeActions.read,
            () => this.mode.get(context, callback),
            fail
        );
    }
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
