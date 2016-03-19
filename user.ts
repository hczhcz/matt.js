'use strict';

import {ValFunc} from './util';
import {Context, User} from './interface';

export class UnixUser implements User {
    constructor(private _group: string, private _name: string) {
        //
    }

    group(context: Context, callback: ValFunc<string>) {
        callback(this._group);
    }

    name(context: Context, callback: ValFunc<string>) {
        callback(this._name);
    }

    distance(context: Context, user: User, callback: ValFunc<number>) {
        user.name(context, (name: string) => {
            if (name === this._name) {
                callback(0);
            } else if (user.group) {
                user.group(context, (group: string) => {
                    if (group === this._group) {
                        callback(1);
                    } else {
                        callback(Infinity);
                    }
                })
            } else {
                callback(Infinity);
            }
        });
    }
};
