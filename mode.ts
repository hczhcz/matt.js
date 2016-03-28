'use strict';

import {SimpleError, ErrFunc, VoidFunc, ValFunc} from './util';
import {Context, User, ModeActions, Mode} from './interface';

export class UnixMode implements Mode {
    constructor(private _user: number, private _group: number, private _all: number) {
        //
    }

    description(context: Context, callback: ValFunc<string>): void {
        callback(String(this._user) + String(this._group) + String(this._all));
    }

    check(
        context: Context, owner: User, action: ModeActions,
        callback: VoidFunc, fail: ErrFunc
    ): void {
        owner.distance(context, context.user, (distance: number): void => {
            let mode = distance === 0 ? this._user
                     : distance === 1 ? this._group
                     : this._all;
            let mask = action === ModeActions.read ? 4
                     : action === ModeActions.write ? 2
                     : action === ModeActions.exec ? 1
                     : 0; // never reach

            if ((mode & mask) === mask) {
                callback();
            } else {
                fail(new SimpleError('access denied'));
            }
        });
    }
};
