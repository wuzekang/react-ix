import { Subscriber, Observable } from "rxjs";
declare class Context<T> {
    private _value;
    constructor(...values: T[]);
    consume(...values: T[]): Observable<T>;
    provide(...values: T[]): Subscriber<T>;
}
export declare function context<T>(value: T): Context<T>;
export {};
