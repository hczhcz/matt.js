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
