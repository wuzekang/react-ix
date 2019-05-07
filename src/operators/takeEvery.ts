import { merge, Observable, combineLatest } from 'rxjs';
import { count, distinctUntilChanged, map, mapTo, mergeAll, share, scan, startWith } from 'rxjs/operators';
import { ProjectFunction, TakeResult } from '../types';

export const takeEvery = <T, R>(project: ProjectFunction<T, R>, concurrent?: number) => (source: Observable<T>): TakeResult<R> => {
    const observer = source.pipe(share());

    const result = observer.pipe(
        map(value => project(value).pipe(share())),
        share(),
    );   
    
    return combineLatest(
        result.pipe(
            mergeAll<R>(concurrent),
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
        )
    );
}