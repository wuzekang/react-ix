import { Observable } from 'rxjs';
import { UnaryFunction } from 'rxjs/internal/types';
interface ProjectFunction<T, R> extends UnaryFunction<T, Observable<R>> {
}
export declare const takeLatest: <T, R>(project: ProjectFunction<T, R>) => (source: Observable<T>) => [Observable<R>, Observable<boolean>];
export {};
