'use strict';

import {Context, User, File} from './interface';

export class PlainContext implements Context {
    constructor(public user: User, public root: File) {
        //
    }
};
