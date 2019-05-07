import { Observable } from 'rxjs';
export declare const takeEvery: <T, R>(project: import("rxjs").UnaryFunction<T, Observable<R>>, concurrent?: number | undefined) => (source: Observable<T>) => Observable<[R, boolean]>;
