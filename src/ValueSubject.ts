import { Subject, Subscriber, Subscription, SubscriptionLike } from 'rxjs';

/**
 * @class ValueSubject<T>
 */
export class ValueSubject<T> extends Subject<T> {
  private hasValue = false;
  private _value;

  /** @deprecated This is an internal implementation detail, do not use. */
  _subscribe(subscriber: Subscriber<T>): Subscription {
    const subscription = super._subscribe(subscriber);
    if (this.hasValue && subscription && !(<SubscriptionLike>subscription).closed) {
      subscriber.next(this._value);
    }
    return subscription;
  }

  next(value: T): void {
    this.hasValue = true;
    super.next(this._value = value);
  }

  clear(): void {
    this.hasValue = false;
  }
}