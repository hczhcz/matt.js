'use strict';

import {ErrFunc, VoidFunc, ValFunc} from './util';
import {Context, User} from './interface';

export class NoUser implements User {
    group(context: Context, callback: ValFunc<string>, fail: ErrFunc): void {
        callback('nobody');
    }

    name(context: Context, callback: ValFunc<string>, fail: ErrFunc): void {
        callback('nobody');
    }

    superuser(context: Context, callback: ValFunc<boolean>, fail: ErrFunc): void {
        callback(false);
    }

    distance(context: Context, callback: ValFunc<number>, fail: ErrFunc): void {
        callback(Infinity);
    }
};

function userDistance(
    context: Context, owner: User,
    callback: ValFunc<number>, fail: ErrFunc
) {
    context.user((user: User): void => {
        user.superuser(context, (superuser: boolean): void => {
            if (superuser) {
                callback(0);
            } else {
                user.name(context, (userName: string): void => {
                    owner.name(context, (ownerName: string): void => {
                        if (userName === ownerName) {
                            callback(0);
                        } else {
                            user.group(context, (userGroup: string): void => {
                                owner.group(context, (ownerGroup: string): void => {
                                    if (userGroup === ownerGroup) {
                                        callback(1);
                                    } else {
                                        callback(Infinity);
                                    }
                                }, fail);
                            }, fail);
                        }
                    }, fail);
                }, fail);
            }
        }, fail);
    });
};

export class UnixUser implements User {
    constructor(private _group: string, private _name: string) {
        //
    }

    group(context: Context, callback: ValFunc<string>, fail: ErrFunc): void {
        callback(this._group);
    }

    name(context: Context, callback: ValFunc<string>, fail: ErrFunc): void {
        callback(this._name);
    }

    superuser(context: Context, callback: ValFunc<boolean>, fail: ErrFunc): void {
        callback(false);
    }

    distance(context: Context, callback: ValFunc<number>, fail: ErrFunc): void {
        userDistance(context, this, callback, fail);
    }
};

export class UnixSuperUser implements User {
    group(context: Context, callback: ValFunc<string>, fail: ErrFunc): void {
        callback('root');
    }

    name(context: Context, callback: ValFunc<string>, fail: ErrFunc): void {
        callback('root');
    }

    superuser(context: Context, callback: ValFunc<boolean>, fail: ErrFunc): void {
        callback(true);
    }

    distance(context: Context, callback: ValFunc<number>, fail: ErrFunc): void {
        userDistance(context, this, callback, fail);
    }
};
