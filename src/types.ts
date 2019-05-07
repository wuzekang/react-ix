import { Observable } from 'rxjs';
import { UnaryFunction } from 'rxjs/internal/types';

export type ProjectFunction<T, R> = UnaryFunction<T, Observable<R>>;
export type TakeResult<R> = Observable<[R, boolean]>;
export type Optional<T> = T | undefined
export type TakeOperator<T, R> = (project: ProjectFunction<T, R>) => (source: Observable<T>) => TakeResult<R>;
