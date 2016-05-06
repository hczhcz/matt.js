'use strict';

import {ErrFunc, VoidFunc, ValFunc} from './util';
import {Context, User, ModeActions, Mode, Node} from './interface';
import {UnixUser, UnixSuperUser} from './user'
import {UnixMode} from './mode';
import {DirNode, FreeObjNode, JsonObjNode} from './node';

const root: Node = new DirNode(
    new UnixMode(7, 5, 5),
    new UnixSuperUser(),
    [
        // ['auth', new DirNode(
        //     new UnixMode(7, 5, 5),
        //     new UnixSuperUser(),
        //     []
        // )],
        ['bin', new DirNode(
            new UnixMode(7, 5, 5),
            new UnixSuperUser(),
            []
        )],
        ['dev', new DirNode(
            new UnixMode(7, 5, 5),
            new UnixSuperUser(),
            []
        )],
        ['home', new DirNode(
            new UnixMode(7, 5, 5),
            new UnixSuperUser(),
            []
        )],
        ['proc', new DirNode(
            new UnixMode(5, 5, 5),
            new UnixSuperUser(),
            []
        )],
    ]
);
