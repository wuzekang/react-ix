import { Observable, Subject } from 'rxjs';
import { UnaryFunction } from 'rxjs/internal/types';
declare type ProjectFunction<T, R> = UnaryFunction<T, Observable<R>>;
export declare function useTakeLatest<T, R>(project: ProjectFunction<T, R>): (initialSource?: T | undefined, initialResult?: R | undefined) => [R | undefined, (source: T) => Subject<R>, boolean];
export {};
