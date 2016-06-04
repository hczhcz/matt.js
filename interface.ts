'use strict';

import {ErrFunc, VoidFunc, ValFunc} from './util';

export interface Context {
    proc(cb_: ValFunc<DirNode>/* , fl_: ErrFunc */): void;
    user(cb_: ValFunc<User>/* , fl_: ErrFunc */): void;
    _setuser(user: User, cb_: VoidFunc/* , fl_: ErrFunc */): void; // internal use

    root(cb_: ValFunc<Node>, fl_: ErrFunc): void;
    dir(cb_: ValFunc<Node>, fl_: ErrFunc): void;
    chroot(node: Node, cb_: VoidFunc, fl_: ErrFunc): void;
    chdir(node: Node, cb_: VoidFunc, fl_: ErrFunc): void;
};

export interface User {
    group(c_: Context, cb_: ValFunc<string>, fl_: ErrFunc): void;
    name(c_: Context, cb_: ValFunc<string>, fl_: ErrFunc): void;
    superuser(c_: Context, cb_: ValFunc<boolean>, fl_: ErrFunc): void;
    distance(c_: Context, cb_: ValFunc<number>, fl_: ErrFunc): void;
};

export const enum ModeActions {read, write, exec, attr};
export interface Mode {
    name(c_: Context, cb_: ValFunc<string>, fl_: ErrFunc): void;
    check(c_: Context, owner: User, action: ModeActions, cb_: VoidFunc, fl_: ErrFunc): void;
};

export interface Node {
    getattr(c_: Context, cb_: (mode: Mode, owner: User) => void, fl_: ErrFunc): void;
    chmod(c_: Context, mode: Mode, cb_: VoidFunc, fl_: ErrFunc): void;
    chown(c_: Context, owner: User, cb_: VoidFunc, fl_: ErrFunc): void;

    getdir(c_: Context, cb_: ValFunc<DirNode>, fl_: ErrFunc): void;
    getlink(c_: Context, cb_: ValFunc<LinkNode>, fl_: ErrFunc): void;
    getobj(c_: Context, cb_: ValFunc<ObjNode>, fl_: ErrFunc): void;
};

export interface DirNode extends Node {
    readdir(c_: Context, cb_: ValFunc<string[]>, fl_: ErrFunc): void;
    link(c_: Context, name: string, node: Node, cb_: VoidFunc, fl_: ErrFunc): void;
    unlink(c_: Context, name: string, cb_: VoidFunc, fl_: ErrFunc): void;
    swap(c_: Context, name: string, node: Node, cb_: VoidFunc, fl_: ErrFunc): void;
    open(c_: Context, name: string, cb_: ValFunc<Node>, fl_: ErrFunc): void;
};

export interface LinkNode extends Node {
    readlink(c_: Context, cb_: ValFunc<string[]>, fl_: ErrFunc): void;
    writelink(c_: Context, path: string[], cb_: VoidFunc, fl_: ErrFunc): void;
    trace(c_: Context, path: string[], cb_: ValFunc<string[]>, fl_: ErrFunc): void;
};

export interface ObjNode extends Node {
    readobj(c_: Context, cb_: ValFunc<any>, fl_: ErrFunc): void;
    writeobj(c_: Context, obj: any, cb_: VoidFunc, fl_: ErrFunc): void;
};
