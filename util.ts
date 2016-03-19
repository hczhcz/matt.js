'use strict';

export interface ErrFunc {
    (err: Error): void;
    (err: string): void; // TODO
};

export interface VoidFunc {
    (): void;
};

export interface ValFunc<T> {
    (value: T): void;
};
