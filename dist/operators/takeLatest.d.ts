import { Observable } from 'rxjs';
export declare const takeLatest: <T, R>(project: (value: T) => Observable<R>) => (observer: Observable<T>) => [Observable<R>, Observable<boolean>];
