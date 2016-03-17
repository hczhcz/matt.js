'use strict';

import {ErrFunc, EmptyFunc} from './func';
import {Context} from './context';

export enum ModeActions {read, write, exec};
export interface Mode {
    // get description
    get(context: Context, callback: (mode: string) => void): void;
    // check permissions
    check(context: Context, action: ModeActions, callback: EmptyFunc, fail: ErrFunc): void;
};
