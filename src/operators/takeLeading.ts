import { combineLatest, Observable, Subject } from 'rxjs';
import { count, distinctUntilChanged, map, mapTo, share, startWith, switchAll, switchMap, withLatestFrom, filter } from 'rxjs/operators';
import { ProjectFunction, TakeResult } from '../types';

export const takeLeading = <T, R>(project: ProjectFunction<T, R>) => (source: Observable<T>): TakeResult<R> => {
    const observer = source.pipe(share());
    const leading = new Subject<T>()

    const result = leading.pipe(
        map(value => project(value).pipe(share())),
        share(),
    );
    
    const loading = combineLatest(
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
    );

    observer.pipe(
        withLatestFrom(loading),
        filter(([, loading]) => !loading),
        map(([value]) => value),
    ).subscribe(leading);

    return combineLatest(
        result.pipe(
            switchAll<R>(),
            share(),
        ),
        loading
    );
}