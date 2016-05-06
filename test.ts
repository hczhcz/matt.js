'use strict';

import {ErrFunc, VoidFunc, ValFunc} from './util';
import {Context, User, ModeActions, Mode, Node} from './interface';
import {UnixUser, UnixSuperUser} from './user'
import {UnixMode} from './mode';
import {DirNode, JsonObjNode, FuncObjNode} from './node';

const root: Node = new DirNode(
    new UnixMode(7, 5, 5),
    new UnixSuperUser(),
    [
        ['auth', new DirNode(
            new UnixMode(7, 5, 5),
            new UnixSuperUser(),
            [
                ['root', new FuncObjNode(
                    new UnixMode(4, 4, 4),
                    new UnixSuperUser(),
                    (callback: ValFunc<any>, fail: ErrFunc): void => {
                        callback(new UnixSuperUser()); // TODO: ask password?
                    },
                    (obj: any, callback: VoidFunc, fail: ErrFunc): void => {
                        fail();
                    }
                )],
                ['test', new FuncObjNode(
                    new UnixMode(4, 4, 4),
                    new UnixUser('test', 'test'),
                    (callback: ValFunc<any>, fail: ErrFunc): void => {
                        callback(new UnixUser('test', 'test')); // TODO: ask password?
                    },
                    (obj: any, callback: VoidFunc, fail: ErrFunc): void => {
                        fail();
                    }
                )],
            ]
        )],
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
            [
                ['root', new DirNode(
                    new UnixMode(7, 0, 0),
                    new UnixSuperUser(),
                    []
                )],
                ['test', new DirNode(
                    new UnixMode(7, 0, 0),
                    new UnixUser('test', 'test'),
                    []
                )],
            ]
        )],
        ['proc', new DirNode(
            new UnixMode(5, 5, 5),
            new UnixSuperUser(),
            []
        )],
    ]
);
