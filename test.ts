'use strict';

import {SimpleError, ErrFunc, VoidFunc, ValFunc} from './util';
import {Context, User, Node} from './interface';
import {PlainContext} from './context';
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
    env: [string, Node][], func: [string, Node][]
): Node {
    return makeSysDir([
        ['parent', parent],
        ['root', root],
        ['dir', dir],
        ['env', makeUserDir(user, env)], // env: args, stdin, stdout, stderr
        ['func', makeUserDir(user, func)], // func: main, signal
    ]);
}

function makeProc0(
    root: Node, dir: Node,
    env: [string, Node][], func: [string, Node][]
): Node {
    return makeSysDir([
        ['root', root],
        ['dir', dir],
        ['env', makeUserDir(superUser, env)], // env: args, stdin, stdout, stderr
        ['func', makeUserDir(superUser, func)], // func: main, signal
    ]);
}

function boot(
    password: string,
    env: [string, Node][], func: [string, Node][],
    callback: ValFunc<Context>, fail: ErrFunc
): void {
    // create root dir structure
    const root: Node = makeSysDir([
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

    // create proc 0
    const proc = makeProc0(root, root, env, func);
    const context = new PlainContext(proc, superUser);

    // mount proc 0
    // assert(dir.open);
    root.open(context, 'proc', (node: Node): void => {
        // assert(node.link);
        node.link(context, '0', proc, (): void => {
            callback(context);
        }, fail);
    }, fail);
}

boot(
    'test',
    [], [],
    (context: Context): void => {
        console.log(context);
    },
    (err: Error): void => {
        console.log(err);
    }
);
