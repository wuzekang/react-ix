export declare const useTakeLeading: <T, R>() => (project: import("rxjs").UnaryFunction<T, import("rxjs").Observable<R>>, initialSource: T, initialResult?: import("../types").Optional<R>) => [(source: T) => import("rxjs").Subject<R>, import("../types").Optional<R>, boolean];