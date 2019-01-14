import { Observable } from 'rxjs';
export declare const takeLeading: <T, R>(project: (value: T) => Observable<R>) => (source: Observable<T>) => [Observable<R>, Observable<boolean>];
