'use strict';

import {SimpleError, ErrFunc, VoidFunc, ValFunc} from './util';
import {Context, User, ModeActions, Mode, Node} from './interface';

class NodeBase {
    constructor(
        private _mode: Mode, // mutable
        private _owner: User // mutable
    ) {
        //
    }

    protected _read(context: Context, callback: VoidFunc, fail: ErrFunc) {
        this._mode.check(context, this._owner, ModeActions.read, callback, fail);
    }

    protected _write(context: Context, callback: VoidFunc, fail: ErrFunc) {
        this._mode.check(context, this._owner, ModeActions.write, callback, fail);
    }

    protected _exec(context: Context, callback: VoidFunc, fail: ErrFunc) {
        this._mode.check(context, this._owner, ModeActions.exec, callback, fail);
    }

    protected _attr(context: Context, callback: VoidFunc, fail: ErrFunc) {
        this._mode.check(context, this._owner, ModeActions.attr, callback, fail);
    }

    getattr(
        context: Context,
        callback: (mode: Mode, owner: User) => void, fail: ErrFunc
    ): void {
        this._read(context, (): void => {
            callback(this._mode, this._owner);
        }, fail);
    }

    chmod(
        context: Context, mode: Mode,
        callback: VoidFunc, fail: ErrFunc
    ): void {
        this._attr(context, (): void => {
            this._mode = mode;
        }, fail);
    }

    chown(
        context: Context, owner: User,
        callback: VoidFunc, fail: ErrFunc
    ): void {
        this._attr(context, (): void => {
            this._owner = owner;
        }, fail);
    }
};

export class DirNode extends NodeBase implements Node {
    private static tag: string = 'ENTRY_';
    private _map: {[key: string]: Node} = {}; // mutable

    constructor(mode: Mode, owner: User, list: [string, Node][]) {
        super(mode, owner);

        for (const pair of list) {
            this._map[DirNode.tag + pair[0]] = pair[1];
        };
    }

    readdir(
        context: Context,
        callback: ValFunc<string[]>, fail: ErrFunc
    ): void {
        this._read(context, (): void => {
            let result: string[] = [];

            for (const name in this._map) {
                result.push(name.slice(DirNode.tag.length));
            }

            callback(result);
        }, fail);
    }

    open(
        context: Context, name: string,
        callback: ValFunc<Node>, fail: ErrFunc
    ): void {
        this._read(context, (): void => {
            const result: Node = this._map[DirNode.tag + name];

            if (result !== undefined) {
                callback(result);
            } else {
                fail(new SimpleError('file not found'));
            }
        }, fail);
    }

    link(
        context: Context, name: string, node: Node,
        callback: VoidFunc, fail: ErrFunc
    ): void {
        this._write(context, (): void => {
            const result: Node = this._map[DirNode.tag + name];

            if (result !== undefined) {
                fail(new SimpleError('file exists'));
            } else {
                this._map[DirNode.tag + name] = node;
                callback();
            }
        }, fail);
    }

    unlink(
        context: Context, name: string,
        callback: ValFunc<Node>, fail: ErrFunc
    ): void {
        this._write(context, (): void => {
            const result: Node = this._map[DirNode.tag + name];

            if (result !== undefined) {
                delete this._map[DirNode.tag + name];
                callback(result);
            } else {
                fail(new SimpleError('file not found'));
            }
        }, fail);
    }

    swap(
        context: Context, name: string, node: Node,
        callback: ValFunc<Node>, fail: ErrFunc
    ): void {
        this._write(context, (): void => {
            const result: Node = this._map[DirNode.tag + name];

            if (result !== undefined) {
                this._map[DirNode.tag + name] = node;
                callback(result);
            } else {
                fail(new SimpleError('file not found'));
            }
        }, fail);
    }
};

export class LinkNode extends NodeBase implements Node {
    constructor(
        mode: Mode,
        owner: User,
        private _node: Node // mutable
    ) {
        super(mode, owner);
    }

    readlink(
        context: Context,
        callback: ValFunc<Node>, fail: ErrFunc
    ): void {
        this._read(context, (): void => {
            callback(this._node);
        }, fail);
    }

    writelink(
        context: Context, node: Node,
        callback: VoidFunc, fail: ErrFunc
    ): void {
        this._write(context, (): void => {
            this._node = node;
            callback();
        }, fail);
    }
};

// export class FileNode extends NodeBase implements Node {};

export class JsonNode extends NodeBase implements Node {
    private _json: string; // mutable

    constructor(mode: Mode, owner: User, json: any) {
        super(mode, owner);

        this._json = JSON.stringify(json);
    }

    readjson(
        context: Context,
        callback: ValFunc<any>, fail: ErrFunc
    ): void {
        this._read(context, (): void => {
            callback(JSON.parse(this._json));
        }, fail);
    }

    writejson(
        context: Context, json: any,
        callback: VoidFunc, fail: ErrFunc
    ): void {
        this._write(context, (): void => {
            this._json = JSON.stringify(json);
            callback();
        }, fail);
    }
};
