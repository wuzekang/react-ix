import { Observable } from 'rxjs';
export declare const takeEvery: <T, R>(project: (value: T) => Observable<R>, concurrent?: number) => (source: Observable<T>) => [Observable<R>, Observable<boolean>];
