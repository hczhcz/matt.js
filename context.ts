'use strict';

import {ErrFunc, VoidFunc, ValFunc} from './util';
import {Context, User, Node} from './interface';

class ContextBase {
    constructor(
        private _root: Node, // mutable
        private _dir: Node // mutable
    ) {
        //
    }

    root(callback: ValFunc<Node>): void {
        callback(this._root);
    }

    dir(callback: ValFunc<Node>): void {
        callback(this._dir);
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

export class PlainContext extends ContextBase implements Context {
    constructor(
        private _parent: Context,
        private _user: User, // mutable // TODO: ?
        root: Node,
        dir: Node
    ) {
        super(root, dir);
    }

    user(callback: ValFunc<User>): void {
        callback(this._user);
    }

    setuser(user: User, callback: VoidFunc, fail: ErrFunc): void {
        this._parent.setuser(user, callback, fail);
    }
};

export class RootContext extends ContextBase implements Context {
    constructor(
        private _user: User,
        root: Node,
        dir: Node
    ) {
        super(root, dir);
    }

    user(callback: ValFunc<User>): void {
        callback(this._user);
    }

    setuser(user: User, callback: VoidFunc, fail: ErrFunc): void {
        // TODO
    }
};
