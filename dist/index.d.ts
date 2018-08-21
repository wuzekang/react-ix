import { ReactNode, ComponentClass } from 'react';
import { Subject, BehaviorSubject, Observable, MonoTypeOperatorFunction } from 'rxjs';
export interface IX<P> {
    loading: <T, R>(params$: Observable<T>, loader: (params: T) => Observable<R>) => [Observable<R>, Observable<boolean>];
    debug: <T>(name: string, ...options: any[]) => MonoTypeOperatorFunction<T>;
    event: <T>(name: string) => Subject<T>;
    lifecycle: Subject<string>;
    dispatch: <T>(name: string) => (payload: T) => void;
    connect: <T>(source: Observable<T>) => Observable<T>;
    handle: <T>(name: string) => (event: T) => void;
    props: BehaviorSubject<P>;
}
interface S {
    element: ReactNode;
}
export declare const component: <P>(displayName: string, fn: (ix: IX<P>) => Observable<ReactNode>) => ComponentClass<P, S>;
export {};
