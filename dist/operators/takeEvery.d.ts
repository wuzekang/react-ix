import { Observable } from 'rxjs';
export declare const takeEvery: <T, R>(project: (value: T) => Observable<R>, concurrent?: number) => (observer: Observable<T>) => [Observable<R>, Observable<boolean>];
