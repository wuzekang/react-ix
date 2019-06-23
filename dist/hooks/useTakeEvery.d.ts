import { ProjectFunction } from '../types';
export declare function useTakeEvery<T, R>(project: ProjectFunction<T, R>, concurrent?: number): (initialSource: T, initialResult?: import("../types").Optional<R>) => [import("../types").Optional<R>, (source: T) => import("rxjs").Subject<R>, boolean, Error | undefined];
