'use strict';

import {SimpleError, ErrFunc, VoidFunc, ValFunc} from './util';
import {User, Node} from './interface';
import {UnixUser, UnixSuperUser} from './user'
import {UnixMode} from './mode';
import {DirNode, FuncObjNode} from './node';

function makeSysDir(list: [string, Node][]): Node {
    return new DirNode(new UnixMode(7, 5, 5), new UnixSuperUser(), list);
}

function makeUserDir(group: string, name: string): Node {
    return new DirNode(new UnixMode(7, 5, 5), new UnixUser(group, name), []);
}

function makeSuperUserDir(): Node {
    return new DirNode(new UnixMode(7, 0, 0), new UnixSuperUser(), []);
}

function makeAuth(user: User, password: string): Node {
    return new FuncObjNode(
        new UnixMode(4, 4, 4),
        user,
        (callback: ValFunc<any>, fail: ErrFunc): void => {
            callback(user); // TODO: ask password?
        },
        (obj: any, callback: VoidFunc, fail: ErrFunc): void => {
            fail(new SimpleError('not writable'));
        }
    );
}

function makeUserAuth(group: string, name: string, password: string): Node {
    return makeAuth(new UnixUser(group, name), password);
}

function makeSuperUserAuth(password: string): Node {
    return makeAuth(new UnixSuperUser(), password);
}

function makeUserHome(group: string, name: string): Node {
    return new DirNode(new UnixMode(7, 5, 5), new UnixUser(group, name), []);
}

function makeSuperUserHome(): Node {
    return new DirNode(new UnixMode(7, 0, 0), new UnixSuperUser(), []);
}

function makeRoot(password: string): Node {
    return makeSysDir([
        ['auth', makeSysDir([
            ['root', makeSuperUserAuth(password)],
        ])],
        ['bin', makeSysDir([])],
        ['dev', makeSysDir([])],
        ['home', makeSysDir([
            ['root', makeSuperUserDir()],
        ])],
        ['proc', makeSysDir([])],
    ]);
}

console.log(makeRoot('test'));
