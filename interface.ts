'use strict';

import {ErrFunc, EmptyFunc} from './util';

export interface Context {
    user: User;
    root: File;
};

export interface User {
    name(context: Context, callback: (name: string) => void): void;
    distance(user: User): number;
};

export enum ModeActions {read, write, exec};
export interface Mode {
    description(context: Context, callback: (description: string) => void): void;
    check(context: Context, action: ModeActions, callback: EmptyFunc, fail: ErrFunc): void;
};

export interface File {
    mode: Mode;

    getattr(
        context: Context,
        callback: (mode: string) => void,
        fail: ErrFunc
    ): void;
};
