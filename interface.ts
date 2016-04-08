'use strict';

import {ErrFunc, VoidFunc, ValFunc} from './util';

export interface Context {
    user(cb_: ValFunc<User>): void;
    process(cb_: ValFunc<Process>): void;
    root(cb_: ValFunc<Node>): void;
};

export interface User {
    name(c_: Context, cb_: ValFunc<string>): void;
    distance(c_: Context, cb_: ValFunc<number>): void;

    // unix
    group?(c_: Context, cb_: ValFunc<string>): void;
    superuser?(c_: Context, cb_: ValFunc<boolean>): void;
};

export interface Process {
    parent(c_: Context, cb_: ValFunc<Process | void>): void;
    owner(c_: Context, cb_: ValFunc<User>): void;
    name(c_: Context, cb_: ValFunc<string>): void;
    args(c_: Context, cb_: ValFunc<string[]>): void;
};

export const enum ModeActions {read, write, exec, attr};
export interface Mode {
    description(c_: Context, cb_: ValFunc<string>): void;
    check(c_: Context, owner: User, action: ModeActions, cb_: VoidFunc, fl_: ErrFunc): void;
};

export interface Node {
    getattr(c_: Context, cb_: (mode: Mode, owner: User) => void, fl_: ErrFunc): void;
    chmod  (c_: Context, mode: Mode, cb_: VoidFunc, fl_: ErrFunc): void;
    chown  (c_: Context, owner: User, cb_: VoidFunc, fl_: ErrFunc): void;

    // dir
    readdir?(c_: Context, cb_: ValFunc<string[]>, fl_: ErrFunc): void;
    open?   (c_: Context, name: string, cb_: ValFunc<Node>, fl_: ErrFunc): void;
    link?   (c_: Context, name: string, node: Node, cb_: VoidFunc, fl_: ErrFunc): void;
    unlink? (c_: Context, name: string, cb_: ValFunc<Node>, fl_: ErrFunc): void;
    swap?   (c_: Context, name: string, node: Node, cb_: ValFunc<Node>, fl_: ErrFunc): void;

    // link
    readlink? (c_: Context, cb_: ValFunc<Node>, fl_: ErrFunc): void;
    writelink?(c_: Context, node: Node, cb_: VoidFunc, fl_: ErrFunc): void;

    // file // TODO: stream io?
    // read? (c_: Context, , cb_: VoidFunc, fl_: ErrFunc): void;
    // write?(c_: Context, , cb_: VoidFunc, fl_: ErrFunc): void;

    // json
    readjson? (c_: Context, cb_: ValFunc<JSON>, fl_: ErrFunc): void;
    writejson?(c_: Context, json: JSON, cb_: VoidFunc, fl_: ErrFunc): void;
};
