'use strict';

import {Context, User, Node} from './interface';

export class PlainContext implements Context {
    constructor(public user: User, public root: Node) {
        //
    }
};
