'use strict';

export interface ErrFunc {
    (err: Error): void;
    (err: string): void; // TODO
};

export interface EmptyFunc {
    (): void;
};

export interface TypedFunc {
    type(callback: (type: string) => void): void; // TODO: replace by typeinfo/constructor?
};
