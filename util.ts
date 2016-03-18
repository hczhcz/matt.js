'use strict';

export interface ErrFunc {
    (err: Error): void;
    (err: string): void; // TODO
};

export interface EmptyFunc {
    (): void;
};
