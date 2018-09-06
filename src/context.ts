import { of, merge, NEVER, Subscriber, Observable } from "rxjs";
import { share } from "rxjs/operators";
import { ValueSubject } from "./ValueSubject";

class ProvideSubscriber<T> extends Subscriber<T> {
    _complete() : void {
        (<ValueSubject<T>>this.destination).clear();
        this.unsubscribe();
    }
}

class Context<T> {
    private _value = new ValueSubject<T>();

    constructor(...values: T[]) {
        merge(NEVER, of(...values)).subscribe(this._value);
    }

    consume(...values: T[]) : Observable<T> {
        merge(NEVER, of(...values)).subscribe(this._value);
        return this._value.pipe(share());
    }

    provide(...values: T[]) : Subscriber<T> {
        merge(NEVER, of(...values)).subscribe(this._value);
        return new ProvideSubscriber(this._value);
    }
}

export function context<T>(value: T): Context<T> {
    return new Context<T>(value);
}