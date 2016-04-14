'use strict';

import {VoidFunc, ValFunc} from './util';
import {Context, User} from './interface';

export class NoUser implements User {
    group(context: Context, callback: ValFunc<string>): void {
        callback('nobody');
    }

    name(context: Context, callback: ValFunc<string>): void {
        callback('nobody');
    }

    superuser(context: Context, callback: ValFunc<boolean>): void {
        callback(false);
    }

    distance(context: Context, callback: ValFunc<number>): void {
        callback(0);
    }
};

export class UnixUser implements User {
    constructor(private _group: string, private _name: string) {
        //
    }

    group(context: Context, callback: ValFunc<string>): void {
        callback(this._group);
    }

    name(context: Context, callback: ValFunc<string>): void {
        callback(this._name);
    }

    superuser(context: Context, callback: ValFunc<boolean>): void {
        callback(false);
    }

    distance(context: Context, callback: ValFunc<number>): void {
        context.user((user: User): void => {
            user.superuser(context, (superuser: boolean): void => {
                if (superuser) {
                    callback(0);
                } else {
                    user.name(context, (name: string): void => {
                        if (name === this._name) {
                            callback(0);
                        } else {
                            user.group(context, (group: string): void => {
                                if (group === this._group) {
                                    callback(1);
                                } else {
                                    callback(Infinity);
                                }
                            });
                        }
                    });
                }
            });
        });
    }
};

export class UnixSuperUser extends UnixUser {
    superuser(context: Context, callback: ValFunc<boolean>): void {
        callback(true);
    }
};
