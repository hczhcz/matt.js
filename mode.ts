'use strict';

import {SimpleError, ErrFunc, VoidFunc, ValFunc} from './util';
import {Context, User, ModeActions, Mode} from './interface';

export class UnixMode implements Mode {
    constructor(
        private _user: number,
        private _group: number,
        private _all: number
    ) {
        //
    }

    name(context: Context, callback: ValFunc<string>, fail: ErrFunc): void {
        callback(String(this._user) + String(this._group) + String(this._all));
    }

    private _check(
        distance: number, action: ModeActions,
        accept: VoidFunc, deny: VoidFunc
    ): void {
        const mode: number = distance === 0 ? this._user
                           : distance === 1 ? this._group
                           : this._all;
        const mask: number = action === ModeActions.read ? 4
                           : action === ModeActions.write ? 2
                           : action === ModeActions.exec ? 1
                           : action === ModeActions.attr && distance === 0 ? 0 // always ok
                           : 255; // always deny

        if ((mode & mask) === mask) {
            accept();
        } else {
            deny();
        }
    }

    check(
        context: Context, owner: User, action: ModeActions,
        callback: VoidFunc, fail: ErrFunc
    ): void {
        this._check(Infinity, action, callback, (): void => {
            // public access denied, apply user's permission
            owner.distance(context, (distance: number): void => {
                this._check(distance, action, callback, (): void => {
                    fail(new SimpleError('access denied'));
                });
            }, fail);
        });
    }
};
