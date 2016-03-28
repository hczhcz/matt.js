'use strict';

import {ValFunc} from './util';
import {Context, User, Node} from './interface';

export class PlainContext implements Context {
    constructor(private _user: User, private _root: Node) {
        //
    }

    user(callback: ValFunc<User>): void {
        callback(this._user);
    }

    root(callback: ValFunc<Node>): void {
        callback(this._root);
    }
};
