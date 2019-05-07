import { combineLatest, Observable } from 'rxjs';
import { count, distinctUntilChanged, map, mapTo, share, startWith, switchAll, switchMap } from 'rxjs/operators';
import { ProjectFunction, TakeResult } from '../types';

export const takeLatest = <T, R>(project: ProjectFunction<T, R>) => (source: Observable<T>): TakeResult<R> => {
    const observer = source.pipe(share());

    const result = observer.pipe(
        map(value => project(value).pipe(share())),
        share(),
    );

    return combineLatest(
        result.pipe(
            switchAll<R>(),
            share(),
        ),
        combineLatest(
            result.pipe(map((_, i) => i + 1)),
            result.pipe(
                switchMap((o, i) =>
                    o.pipe(
                        count(),
                        mapTo(i + 1)
                    )
                ),
                startWith(0),
            )
        ).pipe(
            map(([start, end]) => end < start),
            startWith(false),
            distinctUntilChanged(),
        )
    );
};
