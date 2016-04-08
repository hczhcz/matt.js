'use strict';

import {ValFunc} from './util';
import {Context, User, Process, Node} from './interface';

export class PlainContext implements Context {
    constructor(private _user: User, private _process: Process, private _root: Node) {
        //
    }

    user(callback: ValFunc<User>): void {
        callback(this._user);
    }

    process(callback: ValFunc<Process>): void {
        callback(this._process);
    }

    root(callback: ValFunc<Node>): void {
        callback(this._root);
    }
};
