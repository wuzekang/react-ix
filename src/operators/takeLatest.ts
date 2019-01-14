import { combineLatest, Observable } from 'rxjs';
import { count, distinctUntilChanged, map, mapTo, share, startWith, switchAll, switchMap, takeUntil } from 'rxjs/operators';
import { UnaryFunction } from 'rxjs/internal/types';

interface ProjectFunction<T, R> extends UnaryFunction<T, Observable<R>> {
}

export const takeLatest = <T, R>(project: ProjectFunction<T, R>) => (source: Observable<T>): [Observable<R>, Observable<boolean>] => {
    const observer = source.pipe(share());
    
    const completed = observer.pipe(count());

    const result = observer.pipe(
        map(value => project(value).pipe(share())),
        share(),
    );
    
    return [
        result.pipe(
            switchAll<R>(),
            takeUntil(completed),
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
            takeUntil(completed),
        ),
    ];
}