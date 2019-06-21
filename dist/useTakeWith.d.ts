import { Subject } from 'rxjs';
import { Optional, TakeOperator } from './types';
export declare const useTakeWith: <T, R>(strategy: TakeOperator<[T, Optional<Subject<R>>], Optional<R>>) => (project: import("rxjs").UnaryFunction<T, import("rxjs").Observable<R>>) => (initialSource: T, initialResult?: Optional<R>) => [Optional<R>, (source: T) => Subject<R>, boolean];
