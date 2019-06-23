import { ProjectFunction } from '../types';
export declare function useTakeLeading<T, R>(project: ProjectFunction<T, R>): (initialSource: T, initialResult?: import("../types").Optional<R>) => [import("../types").Optional<R>, (source: T) => import("rxjs").Subject<R>, boolean, Error | undefined];
