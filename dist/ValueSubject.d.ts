import { Subject, Subscriber, Subscription } from 'rxjs';
export declare class ValueSubject<T> extends Subject<T> {
    private hasValue;
    private _value;
    _subscribe(subscriber: Subscriber<T>): Subscription;
    next(value: T): void;
    clear(): void;
}
