import { Observable } from 'rxjs';
export declare const takeLatest: <T, R>(project: import("rxjs").UnaryFunction<T, Observable<R>>) => (source: Observable<T>) => Observable<[R, boolean]>;
