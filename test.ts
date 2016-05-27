'use strict';

import {SimpleError, ErrFunc, VoidFunc, ValFunc} from './util';
import {Context, User, Node} from './interface';
import {UnixUser, UnixSuperUser} from './user'
import {UnixMode} from './mode';
import {DirNode, FuncObjNode} from './node';

const superUser = new UnixSuperUser();

function makeSysDir(list: [string, Node][]): Node {
    return new DirNode(new UnixMode(7, 5, 5), superUser, list);
}

function makeUserDir(user: User, list: [string, Node][]): Node {
    return new DirNode(new UnixMode(7, 5, 5), user, list);
}

function makeSuperUserDir(list: [string, Node][]): Node {
    return new DirNode(new UnixMode(7, 0, 0), superUser, list);
}

function makeAuth(user: User, password: string): Node {
    return new FuncObjNode(
        new UnixMode(4, 4, 4),
        user,
        (context: Context, callback: ValFunc<any>, fail: ErrFunc): void => {
            // TODO: ask password
            context.setuser(user, (): void => {
                callback(true);
            });
        },
        (context: Context, obj: any, callback: VoidFunc, fail: ErrFunc): void => {
            fail(new SimpleError('not writable'));
        }
    );
}

function makeUserAuth(group: string, name: string, password: string): Node {
    return makeAuth(new UnixUser(group, name), password);
}

function makeSuperUserAuth(password: string): Node {
    return makeAuth(superUser, password);
}

function makeProc(
    user: User,
    parent: Node,
    root: Node, dir: Node,
    env: [string, Node][],
    func: [string, Node][]
): Node {
    return makeSysDir([
        ['parent', parent],
        ['root', root],
        ['dir', dir],
        ['env', makeUserDir(user, env)], // env: stdin, stdout, stderr
        ['func', makeUserDir(user, func)], // func: main, signal
    ]);
}

function makeRoot(password: string): Node {
    return makeSysDir([
        ['auth', makeSysDir([
            ['root', makeSuperUserAuth(password)],
        ])],
        ['bin', makeSysDir([])],
        ['dev', makeSysDir([])],
        ['home', makeSysDir([
            ['root', makeSuperUserDir([])],
        ])],
        ['proc', makeSysDir([])],
    ]);
}

console.log(makeRoot('test'));
