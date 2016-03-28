'use strict';

import {SimpleError, ErrFunc, VoidFunc, ValFunc} from './util';
import {Context, User, ModeActions, Mode, Node} from './interface';

export class BaseNode implements Node {
    constructor(private _mode: Mode, private _owner: User) {
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

    getattr(
        context: Context,
        callback: (mode: Mode, owner: User) => void, fail: ErrFunc
    ): void {
        this._read(context, (): void => {
            //
        }, fail);
    }

    chmod(
        context: Context, mode: Mode,
        callback: VoidFunc, fail: ErrFunc
    ): void {
        this._write(context, (): void => {
            //
        }, fail);
    }

    chown(
        context: Context, owner: User,
        callback: VoidFunc, fail: ErrFunc
    ): void {
        this._write(context, (): void => {
            //
        }, fail);
    }
};

export class DirNode extends BaseNode {
    readdir(
        context: Context,
        callback: ValFunc<string[]>, fail: ErrFunc
    ): void {
        this._read(context, (): void => {
            //
        }, fail);
    }

    open(
        context: Context, name: string,
        callback: ValFunc<Node>, fail: ErrFunc
    ): void {
        this._read(context, (): void => {
            //
        }, fail);
    }

    link(
        context: Context, name: string, node: Node,
        callback: VoidFunc, fail: ErrFunc
    ): void {
        this._write(context, (): void => {
            //
        }, fail);
    }

    unlink(
        context: Context, name: string,
        callback: ValFunc<Node>, fail: ErrFunc
    ): void {
        this._write(context, (): void => {
            //
        }, fail);
    }

    swap(
        context: Context, name: string, node: Node,
        callback: ValFunc<Node>, fail: ErrFunc
    ): void {
        this._write(context, (): void => {
            //
        }, fail);
    }
};

export class LinkNode extends BaseNode {
    readlink(
        context: Context,
        callback: ValFunc<Node>, fail: ErrFunc
    ): void {
        this._read(context, (): void => {
            //
        }, fail);
    }

    writelink(
        context: Context, node: Node,
        callback: VoidFunc, fail: ErrFunc
    ): void {
        this._write(context, (): void => {
            //
        }, fail);
    }
};

// export class FileNode extends BaseNode {};

export class JsonNode extends BaseNode {
    readjson(
        context: Context,
        callback: ValFunc<JSON>, fail: ErrFunc
    ): void {
        this._read(context, (): void => {
            //
        }, fail);
    }

    writejson(
        context: Context, json: JSON,
        callback: VoidFunc, fail: ErrFunc
    ): void {
        this._write(context, (): void => {
            //
        }, fail);
    }
};
