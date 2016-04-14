'use strict';

import {ErrFunc, VoidFunc, ValFunc} from './util';
import {Context, User, Node} from './interface';

export class PlainContext implements Context {
    constructor(
        private _parent: Context,
        private _args: string[],
        private _user: User,
        private _root: Node,
        private _dir: Node
    ) {
        //
    }

    parent(callback: ValFunc<Context>): void {
        callback(this._parent);
    }

    args(callback: ValFunc<string[]>): void {
        callback(this._args);
    }

    user(callback: ValFunc<User>): void {
        callback(this._user);
    }

    root(callback: ValFunc<Node>): void {
        callback(this._root);
    }

    dir(callback: ValFunc<Node>): void {
        callback(this._dir);
    }

    setuser(user: User, callback: VoidFunc, fail: ErrFunc): void {
        // TODO
    }

    chroot(node: Node, callback: VoidFunc): void {
        this._root = node;
        callback();
    }

    chdir(node: Node, callback: VoidFunc): void {
        this._dir = node;
        callback();
    }
};
