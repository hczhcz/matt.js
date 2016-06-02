'use strict';

export class SimpleError extends Error {}; // TODO

export interface ErrFunc {
    (err: Error): void;
};

export interface VoidFunc {
    (): void;
};

export interface ValFunc<T> {
    (value: T): void;
};

export function errMethod(...args: any[]): void {
    <ErrFunc>(args[args.length - 1])(new SimpleError('not supported'));
}
