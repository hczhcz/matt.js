'use strict';

import {SimpleError,  ErrFunc, VoidFunc, ValFunc} from './util';
import {Context, User, Node} from './interface';

export class PlainContext implements Context {
    constructor(
        private _proc: Node, // mutable, for initialization only
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

    _setproc(node: Node, callback: VoidFunc): void {
        this._proc = node;
        callback();
    }

    _setuser(user: User, callback: VoidFunc): void {
        this._user = user;
        callback();
    }

    root(callback: ValFunc<Node>, fail: ErrFunc): void {
        this._proc.open(this, 'root', callback, fail);
    }

    dir(callback: ValFunc<Node>, fail: ErrFunc): void {
        this._proc.open(this, 'dir', callback, fail);
    }

    chroot(node: Node, callback: VoidFunc, fail: ErrFunc): void {
        this._proc.swap(this, 'root', node, callback, fail);
    }

    chdir(node: Node, callback: VoidFunc, fail: ErrFunc): void {
        this._proc.swap(this, 'dir', node, callback, fail);
    }
};

export class ContextUser extends PlainContext implements User {
    constructor(
        proc: Node,
        user: User
    ) {
        super(proc, user);
    }

    group(context: Context, callback: ValFunc<string>, fail: ErrFunc): void {
        this.user((user: User): void => {
            user.group(context, callback, fail);
        });
    }

    name(context: Context, callback: ValFunc<string>, fail: ErrFunc): void {
        this.user((user: User): void => {
            user.name(context, callback, fail);
        });
    }

    superuser(context: Context, callback: ValFunc<boolean>, fail: ErrFunc): void {
        this.user((user: User): void => {
            user.superuser(context, callback, fail);
        });
    }

    distance(context: Context, callback: ValFunc<number>, fail: ErrFunc): void {
        this.user((user: User): void => {
            user.distance(context, callback, fail);
        });
    }
};
