'use strict';

import {SimpleError, ErrFunc, VoidFunc, ValFunc} from './util';
import {Context, User, Node} from './interface';

class ContextBase {
    constructor(
        private _root: Node,
        private _dir: Node
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
        private _user: User,
        root: Node,
        dir: Node
    ) {
        super(root, dir);
    }

    parent(callback: ValFunc<Context>, fail: ErrFunc): void {
        callback(this._parent);
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

    parent(callback: ValFunc<Context>, fail: ErrFunc): void {
        fail(new SimpleError('parent context not exist'));
    }

    user(callback: ValFunc<User>): void {
        callback(this._user);
    }

    setuser(user: User, callback: VoidFunc, fail: ErrFunc): void {
        // TODO
    }
};
