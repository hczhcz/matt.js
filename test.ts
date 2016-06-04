'use strict';

import {SimpleError, ErrFunc, VoidFunc, ValFunc} from './util';
import {Context, User, Node, DirNode, ObjNode} from './interface';
import {ContextUser} from './context';
import {UnixUser, UnixSuperUser} from './user'
import {UnixMode} from './mode';
import {PlainDirNode, JsonObjNode, FuncObjNode} from './node';

const superUser: User = new UnixSuperUser();

function makeSysDir(list: [string, Node][]): DirNode {
    return new PlainDirNode(new UnixMode(7, 5, 5), superUser, list);
}

function makeUserDir(user: User, list: [string, Node][]): DirNode {
    return new PlainDirNode(new UnixMode(7, 5, 5), user, list);
}

function makeSuperUserDir(list: [string, Node][]): DirNode {
    return new PlainDirNode(new UnixMode(7, 0, 0), superUser, list);
}

function makeSysFile(obj: any): ObjNode {
    return new JsonObjNode(new UnixMode(6, 4, 4), superUser, obj);
}

function makeAuth(user: User, password: string): ObjNode {
    return new FuncObjNode(
        new UnixMode(4, 4, 4),
        user,
        (context: Context, callback: ValFunc<any>, fail: ErrFunc): void => {
            // TODO: ask password
            context._setuser(user, (): void => {
                callback(true);
            });
        },
        (context: Context, obj: any, callback: VoidFunc, fail: ErrFunc): void => {
            fail(new SimpleError('not writable'));
        }
    );
}

function makeUserAuth(group: string, name: string, password: string): ObjNode {
    return makeAuth(new UnixUser(group, name), password);
}

function makeSuperUserAuth(password: string): ObjNode {
    return makeAuth(superUser, password);
}

function makeProc(
    user: User,
    parent: DirNode,
    root: Node, dir: Node,
    env: [string, Node][], func: [string, Node][]
): DirNode {
    return makeUserDir(user, [
        ['parent', parent],
        ['root', root],
        ['dir', dir],
        ['env', makeUserDir(user, env)], // env: args, stdin, stdout, stderr
        ['func', makeUserDir(user, func)], // func: main, signal
    ]);
}

function makeProc0(
    user: User,
    root: Node, dir: Node,
    env: [string, Node][], func: [string, Node][]
): DirNode {
    return makeUserDir(user, [
        ['root', root],
        ['dir', dir],
        ['env', makeUserDir(user, env)], // env: args, stdin, stdout, stderr
        ['func', makeUserDir(user, func)], // func: main, signal
    ]);
}

function boot(
    password: string,
    env: [string, Node][], func: [string, Node][],
    callback: ValFunc<Context>, fail: ErrFunc
): void {
    // create root dir structure
    const auth: DirNode = makeSysDir([
        ['root', makeSuperUserAuth(password)],
    ]);
    const bin: DirNode = makeSysDir([]);
    const dev: DirNode = makeSysDir([]);
    const home: DirNode = makeSysDir([
        ['root', makeSuperUserDir([])],
    ]);
    const proc: DirNode = makeSysDir([
        ['id', makeSysFile(1)],
    ]);
    const root: DirNode = makeSysDir([
        ['auth', auth],
        ['bin', bin],
        ['dev', dev],
        ['home', home],
        ['proc', proc],
    ]);

    // create proc 0
    const cu: ContextUser = new ContextUser(undefined, superUser);
    const context: Context = cu;
    const proc0 = makeProc0(cu, root, root, env, func);

    // mount proc 0
    cu._setproc(proc0, (): void => {
        proc.link(context, '0', proc0, (): void => {
            callback(context);
        }, fail);
    });
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
