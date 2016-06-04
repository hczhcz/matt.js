'use strict';

import {SimpleError, ErrFunc, VoidFunc, ValFunc} from './util';
import {
    Context, User, ModeActions, Mode,
    Node, DirNode, LinkNode, ObjNode
} from './interface';

class NodeBase implements Node {
    constructor(
        private _mode: Mode, // mutable
        private _owner: User // mutable
    ) {
        //
    }

    protected _read(context: Context, callback: VoidFunc, fail: ErrFunc): void {
        this._mode.check(context, this._owner, ModeActions.read, callback, fail);
    }

    protected _write(context: Context, callback: VoidFunc, fail: ErrFunc): void {
        this._mode.check(context, this._owner, ModeActions.write, callback, fail);
    }

    protected _exec(context: Context, callback: VoidFunc, fail: ErrFunc): void {
        this._mode.check(context, this._owner, ModeActions.exec, callback, fail);
    }

    protected _attr(context: Context, callback: VoidFunc, fail: ErrFunc): void {
        this._mode.check(context, this._owner, ModeActions.attr, callback, fail);
    }

    getattr(
        context: Context,
        callback: (mode: Mode, owner: User) => void, fail: ErrFunc
    ): void {
        callback(this._mode, this._owner);
    }

    chmod(
        context: Context, mode: Mode,
        callback: VoidFunc, fail: ErrFunc
    ): void {
        this._attr(context, (): void => {
            this._mode = mode;
            callback();
        }, fail);
    }

    chown(
        context: Context, owner: User,
        callback: VoidFunc, fail: ErrFunc
    ): void {
        this._attr(context, (): void => {
            this._owner = owner;
            callback();
        }, fail);
    }

    getdir(accept: ValFunc<DirNode>, deny: VoidFunc): void {
        // fail(new SimpleError('not a directory'));
        deny();
    }

    getlink(accept: ValFunc<LinkNode>, deny: VoidFunc): void {
        // fail(new SimpleError('not a link'));
        deny();
    }

    getobj(accept: ValFunc<ObjNode>, deny: VoidFunc): void {
        // fail(new SimpleError('not an object'));
        deny();
    }
};

export class PlainDirNode extends NodeBase implements DirNode {
    private static tag: string = 'ENTRY_';
    private _map: {[key: string]: Node} = {}; // mutable

    constructor(
        mode: Mode,
        owner: User,
        list: [string, Node][]
    ) {
        super(mode, owner);

        for (const pair of list) {
            this._map[PlainDirNode.tag + pair[0]] = pair[1];
        };
    }

    getdir(accept: ValFunc<DirNode>, deny: ErrFunc): void {
        accept(this);
    }

    readdir(
        context: Context,
        callback: ValFunc<string[]>, fail: ErrFunc
    ): void {
        this._read(context, (): void => {
            let result: string[] = [];

            for (const name in this._map) {
                result.push(name.slice(PlainDirNode.tag.length));
            }

            callback(result);
        }, fail);
    }

    link(
        context: Context, name: string, node: Node,
        callback: VoidFunc, fail: ErrFunc
    ): void {
        this._write(context, (): void => {
            const result: Node = this._map[PlainDirNode.tag + name];

            if (result !== undefined) {
                fail(new SimpleError('file exists'));
            } else {
                this._map[PlainDirNode.tag + name] = node;
                callback();
            }
        }, fail);
    }

    unlink(
        context: Context, name: string,
        callback: VoidFunc, fail: ErrFunc
    ): void {
        this._write(context, (): void => {
            const result: Node = this._map[PlainDirNode.tag + name];

            if (result !== undefined) {
                delete this._map[PlainDirNode.tag + name];
                callback();
            } else {
                fail(new SimpleError('file not found'));
            }
        }, fail);
    }

    swap(
        context: Context, name: string, node: Node,
        callback: VoidFunc, fail: ErrFunc
    ): void {
        this._write(context, (): void => {
            const result: Node = this._map[PlainDirNode.tag + name];

            if (result !== undefined) {
                this._map[PlainDirNode.tag + name] = node;
                callback();
            } else {
                fail(new SimpleError('file not found'));
            }
        }, fail);
    }

    open(
        context: Context, name: string,
        callback: ValFunc<Node>, fail: ErrFunc
    ): void {
        this._exec(context, (): void => {
            const result: Node = this._map[PlainDirNode.tag + name];

            if (result !== undefined) {
                callback(result);
            } else {
                fail(new SimpleError('file not found'));
            }
        }, fail);
    }
};

export class RelLinkNode extends NodeBase implements LinkNode {
    constructor(
        mode: Mode,
        owner: User,
        private _path: string[] // mutable
    ) {
        super(mode, owner);
    }

    getlink(accept: ValFunc<LinkNode>, deny: ErrFunc): void {
        accept(this);
    }

    readlink(
        context: Context,
        callback: ValFunc<string[]>, fail: ErrFunc
    ): void {
        this._read(context, (): void => {
            callback(this._path);
        }, fail);
    }

    writelink(
        context: Context, path: string[],
        callback: VoidFunc, fail: ErrFunc
    ): void {
        this._write(context, (): void => {
            this._path = path;
            callback();
        }, fail);
    }

    trace(
        context: Context, path: string[],
        callback: ValFunc<string[]>, fail: ErrFunc
    ): void {
        this._exec(context, (): void => {
            callback(path.concat(this._path));
        }, fail);
    }
};

export class AbsLinkNode extends NodeBase implements LinkNode {
    constructor(
        mode: Mode,
        owner: User,
        private _path: string[] // mutable
    ) {
        super(mode, owner);
    }

    getlink(accept: ValFunc<LinkNode>, deny: ErrFunc): void {
        accept(this);
    }

    readlink(
        context: Context,
        callback: ValFunc<string[]>, fail: ErrFunc
    ): void {
        this._read(context, (): void => {
            callback(this._path);
        }, fail);
    }

    writelink(
        context: Context, path: string[],
        callback: VoidFunc, fail: ErrFunc
    ): void {
        this._write(context, (): void => {
            this._path = path;
            callback();
        }, fail);
    }

    trace(
        context: Context, path: string[],
        callback: ValFunc<string[]>, fail: ErrFunc
    ): void {
        this._exec(context, (): void => {
            callback(this._path);
        }, fail);
    }
};

export class JsonObjNode extends NodeBase implements ObjNode {
    private _json: string; // mutable

    constructor(mode: Mode, owner: User, obj: any) {
        super(mode, owner);

        this._json = JSON.stringify(obj);
    }

    getobj(accept: ValFunc<ObjNode>, deny: ErrFunc): void {
        accept(this);
    }

    readobj(
        context: Context,
        callback: ValFunc<any>, fail: ErrFunc
    ): void {
        this._read(context, (): void => {
            callback(JSON.parse(this._json));
        }, fail);
    }

    writeobj(
        context: Context, obj: any,
        callback: VoidFunc, fail: ErrFunc
    ): void {
        this._write(context, (): void => {
            this._json = JSON.stringify(obj);
            callback();
        }, fail);
    }
};

export class FuncObjNode extends NodeBase implements ObjNode {
    constructor(
        mode: Mode,
        owner: User,
        private _readhook: (c_: Context, cb_: ValFunc<any>, fl_: ErrFunc) => void,
        private _writehook: (c_: Context, obj: any, cb_: VoidFunc, fl_: ErrFunc) => void
    ) {
        super(mode, owner);
    }

    getobj(accept: ValFunc<ObjNode>, deny: ErrFunc): void {
        accept(this);
    }

    readobj(
        context: Context,
        callback: ValFunc<any>, fail: ErrFunc
    ): void {
        this._read(context, (): void => {
            this._readhook(context, callback, fail);
        }, fail);
    }

    writeobj(
        context: Context, obj: any,
        callback: VoidFunc, fail: ErrFunc
    ): void {
        this._write(context, (): void => {
            this._writehook(context, obj, callback, fail);
        }, fail);
    }
};
