'use strict';

import {ErrFunc, EmptyFunc} from './util';

export interface Context {
    user: User;
    root: File;
};

export interface User {
    name(c_: Context, cb_: (name: string) => void): void;
    distance(user: User): number;
};

export enum ModeActions {read, write, exec};
export interface Mode {
    description(c_: Context, cb_: (mode: string) => void): void;
    check(c_: Context, action: ModeActions, cb_: EmptyFunc, fl_: ErrFunc): void;
};

export interface File {
    getattr(c_: Context, cb_: (mode: string, owner: User) => void, fl_: ErrFunc): void;

};
