'use strict';

import {VoidFunc, ValFunc} from './util';
import {Context, User} from './interface';

export class NoUser implements User {
    name(context: Context, callback: ValFunc<string>): void {
        callback('nobody');
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
            const nonsuper: VoidFunc = (): void => {
                user.name(context, (name: string): void => {
                    if (name === this._name) {
                        callback(0);
                    } else if (user.group !== undefined) {
                        user.group(context, (group: string): void => {
                            if (group === this._group) {
                                callback(1);
                            } else {
                                callback(Infinity);
                            }
                        });
                    } else {
                        callback(Infinity);
                    }
                });
            }

            if (user.superuser !== undefined) {
                user.superuser(context, (superuser: boolean): void => {
                    if (superuser) {
                        callback(0);
                    } else {
                        nonsuper();
                    }
                });
            } else {
                nonsuper();
            }
        });
    }
};

export class UnixSuperUser extends UnixUser {
    superuser(context: Context, callback: ValFunc<boolean>): void {
        callback(true);
    }
};
