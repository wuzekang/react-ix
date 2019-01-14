import { merge, Observable } from 'rxjs';
import { count, distinctUntilChanged, map, mapTo, mergeAll, share, scan, startWith, takeUntil } from 'rxjs/operators';

export const takeEvery = <T, R>(project: (value: T) => Observable<R>, concurrent?: number) => (source: Observable<T>): [Observable<R>, Observable<boolean>] => {
    const observer = source.pipe(share());
    const completed = observer.pipe(count());

    const result = observer.pipe(
        map(value => project(value).pipe(share())),
        share(),
    );
    
    return [
        result.pipe(
            mergeAll<R>(concurrent),
            takeUntil(completed),
            share(),
        ),
        merge(
            result.pipe(mapTo(+1)),
            result.pipe(
                map(o => o.pipe(count(), mapTo(-1))),
                mergeAll<number>(concurrent)
            ),
        ).pipe(
            scan<number>((acc, value) => (acc + value), 0),
            startWith(0),
            map(value => value > 0),
            distinctUntilChanged(),
            takeUntil(completed),
        )
    ];
}