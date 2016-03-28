'use strict';

import {SimpleError, ErrFunc, VoidFunc, ValFunc} from './util';
import {Context, User, Mode, Node} from './interface';

export class BaseNode implements Node {
    getattr(
        context: Context,
        callback: (mode: string, owner: User) => void, fail: ErrFunc
    ): void {
        //
    }

    chmod(
        context: Context, mode: Mode,
        callback: VoidFunc, fail: ErrFunc
    ): void {
        //
    }

    chown(
        context: Context, owner: User,
        callback: VoidFunc, fail: ErrFunc
    ): void {
        //
    }
};

export class DirNode extends BaseNode {
    readdir(
        context: Context,
        callback: ValFunc<string[]>, fail: ErrFunc
    ): void {
        //
    }

    open(
        context: Context, name: string,
        callback: ValFunc<Node>, fail: ErrFunc
    ): void {
        //
    }

    link(
        context: Context, name: string, node: Node,
        callback: VoidFunc, fail: ErrFunc
    ): void {
        //
    }

    unlink(
        context: Context, name: string,
        callback: ValFunc<Node>, fail: ErrFunc
    ): void {
        //
    }

    swap(
        context: Context, name: string, node: Node,
        callback: ValFunc<Node>, fail: ErrFunc
    ): void {
        //
    }
};

export class LinkNode extends BaseNode {
    readlink(
        context: Context,
        callback: ValFunc<Node>, fail: ErrFunc
    ): void {
        //
    }

    writelink(
        context: Context, node: Node,
        callback: VoidFunc, fail: ErrFunc
    ): void {
        //
    }
};

// export class FileNode extends BaseNode {};

export class JsonNode extends BaseNode {
    readjson(
        context: Context,
        callback: ValFunc<JSON>, fail: ErrFunc
    ): void {
        //
    }

    writejson(
        context: Context, json: JSON,
        callback: VoidFunc, fail: ErrFunc
    ): void {
        //
    }
};
