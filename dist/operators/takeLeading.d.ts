import { Observable } from 'rxjs';
export declare const takeLeading: <T, R>(project: import("rxjs").UnaryFunction<T, Observable<R>>) => (source: Observable<T>) => Observable<[R, boolean]>;
