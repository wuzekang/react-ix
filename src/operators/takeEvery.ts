import { merge, Observable } from 'rxjs';
import { count, map, mapTo, mergeAll, share, scan, startWith, takeUntil } from 'rxjs/operators';

export const takeEvery = <T, R>(project: (value: T) => Observable<R>, concurrent?: number) => (observer: Observable<T>): [Observable<R>, Observable<boolean>] => {
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
            result.pipe(o => o.pipe(count(), mapTo(-1))),
        ).pipe(
            scan<number>((acc, value) => (acc + value), 0),
            startWith(0),
            map(value => value > 0),
            takeUntil(completed),
        )
    ];
}