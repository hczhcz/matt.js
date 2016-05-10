'use strict';

import {ErrFunc, VoidFunc, ValFunc} from './util';
import {Context, User, Node} from './interface';

export class PlainContext implements Context {
    constructor(
        private _proc: Node,
        private _user: User // mutable
    ) {
        //
    }

    proc(callback: ValFunc<Node>): void {
        callback(this._proc);
    }

    user(callback: ValFunc<User>): void {
        callback(this._user);
    }

    setuser(user: User, callback: VoidFunc, fail: ErrFunc): void {
        //
    }

    root(callback: ValFunc<Node>): void {
        callback(this._root); // TODO
    }

    dir(callback: ValFunc<Node>): void {
        callback(this._dir); // TODO
    }

    chroot(node: Node, callback: VoidFunc): void {
        this._root = node; // TODO
        callback();
    }

    chdir(node: Node, callback: VoidFunc): void {
        this._dir = node; // TODO
        callback();
    }

};
