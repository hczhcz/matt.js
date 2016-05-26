'use strict';

import {SimpleError,  ErrFunc, VoidFunc, ValFunc} from './util';
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

    setuser(user: User, callback: VoidFunc): void {
        this._user = user;
        callback();
    }

    root(callback: ValFunc<Node>, fail: ErrFunc): void {
        if (this._proc.open) {
            this._proc.open(this, 'root', callback, fail);
        } else {
            fail(new SimpleError('???')); // TODO
        }
    }

    dir(callback: ValFunc<Node>, fail: ErrFunc): void {
        if (this._proc.open) {
            this._proc.open(this, 'dir', callback, fail);
        } else {
            fail(new SimpleError('???')); // TODO
        }
    }

    chroot(node: Node, callback: VoidFunc, fail: ErrFunc): void {
        if (this._proc.swap) {
            this._proc.swap(this, 'root', node, callback, fail);
        } else {
            fail(new SimpleError('???')); // TODO
        }
    }

    chdir(node: Node, callback: VoidFunc, fail: ErrFunc): void {
        if (this._proc.swap) {
            this._proc.swap(this, 'dir', node, callback, fail);
        } else {
            fail(new SimpleError('???')); // TODO
        }
    }

};
