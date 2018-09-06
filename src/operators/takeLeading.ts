import { combineLatest, Observable, Subject } from 'rxjs';
import { count, map, mapTo, share, startWith, switchAll, switchMap, takeUntil, withLatestFrom, filter } from 'rxjs/operators';

export const takeLeading = <T, R>(project: (value: T) => Observable<R>) => (observer: Observable<T>) : [Observable<R>, Observable<boolean>] => {
    const completed = observer.pipe(count());
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
        takeUntil(completed),
    );

    observer.pipe(
        withLatestFrom(loading),
        filter(([, loading]) => !loading),
        map(([value]) => value),
    ).subscribe(leading);

    return [
        result.pipe(
            switchAll<R>(),
            takeUntil(completed),
            share(),
        ),
        loading,
    ];
}