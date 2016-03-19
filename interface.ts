'use strict';

import {ErrFunc, VoidFunc, ValFunc} from './util';

export interface Context {
    user: User;
    root: File;
};

export interface User {
    name(c_: Context, cb_: ValFunc<string>): void;
    distance(user: User): number;
};

export enum ModeActions {read, write, exec};
export interface Mode {
    description(c_: Context, cb_: ValFunc<string>): void;
    check(c_: Context, action: ModeActions, cb_: VoidFunc, fl_: ErrFunc): void;
};

export interface File {
    getattr(c_: Context, cb_: (mode: string, owner: User) => void, fl_: ErrFunc): void;
    chmod  (c_: Context, mode: Mode, cb_: VoidFunc, fl_: ErrFunc): void;
    chown  (c_: Context, owner: User, cb_: VoidFunc, fl_: ErrFunc): void;

    // dir
    readdir(c_: Context, cb_: ValFunc<string[]>, fl_: ErrFunc): void;
    open   (c_: Context, name: string, cb_: ValFunc<File>, fl_: ErrFunc): void;
    link   (c_: Context, name: string, file: File, cb_: VoidFunc, fl_: ErrFunc): void;
    unlink (c_: Context, name: string, cb_: ValFunc<File>, fl_: ErrFunc): void;
    swap   (c_: Context, name: string, file: File, cb_: ValFunc<File>, fl_: ErrFunc): void;

    // link
    readlink (c_: Context, cb_: ValFunc<File>, fl_: ErrFunc): void;
    writelink(c_: Context, file: File, cb_: VoidFunc, fl_: ErrFunc): void;

    // file // TODO: stream io?
    // read (c_: Context, , cb_: VoidFunc, fl_: ErrFunc): void;
    // write(c_: Context, , cb_: VoidFunc, fl_: ErrFunc): void;

    // json
    readjson (c_: Context, cb_: ValFunc<JSON>, fl_: ErrFunc): void;
    writejson(c_: Context, json: JSON, cb_: VoidFunc, fl_: ErrFunc): void;
};
