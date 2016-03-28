'use strict';

import {ValFunc} from './util';
import {Context, User} from './interface';

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

    distance(context: Context, callback: ValFunc<number>): void {
        context.user((user: User): void => {
            user.name(context, (name: string): void => {
                if (name === this._name) {
                    callback(0);
                } else if (user.group) {
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
        });
    }
};
