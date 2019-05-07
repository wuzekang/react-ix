import { Observable } from 'rxjs';
import { UnaryFunction } from 'rxjs/internal/types';
export declare type ProjectFunction<T, R> = UnaryFunction<T, Observable<R>>;
export declare type TakeResult<R> = Observable<[R, boolean]>;
export declare type Optional<T> = T | undefined;
export declare type TakeOperator<T, R> = (project: ProjectFunction<T, R>) => (source: Observable<T>) => TakeResult<R>;
