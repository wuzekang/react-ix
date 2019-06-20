import { useMemo, useState } from 'react';
import { Observable, Subject } from 'rxjs';
import { useObservable } from 'rxjs-hooks';
import { OperatorFunction, UnaryFunction } from 'rxjs/internal/types';
import { filter, tap } from 'rxjs/operators';

import { takeLatest } from '../operators/takeLatest'

type ProjectFunction<T, R> = UnaryFunction<T, Observable<R>>;

export function useTakeLatest<T, R>(project: ProjectFunction<T, R>) {

    return function(initialSource?: T, initialResult?: R): [R | undefined, (source: T) => Subject<R>, boolean]  {
        const [source, setSource] = useState<[T | undefined, Subject<R> | undefined]>([initialSource, undefined]);

        const invoke = useMemo(() =>
            (source: T) => {
                const notifier = new Subject<R>()
                setSource([source, notifier])
                return notifier;
            }, []
        );
    
        const [result, taking] = useObservable<[R | undefined, boolean], [T | undefined, Subject<R> | undefined]>(
            query$ => query$.pipe(
                filter(([source,]) => source !== undefined) as OperatorFunction<[T | undefined, Subject<R> | undefined], [T, Subject<R> | undefined]>,
                takeLatest(
                    ([source, notifier]) =>
                        notifier
                            ? project(source)
                                .pipe(
                                    tap(notifier)
                                )
                            : project(source)
                ),
            ),
            [initialResult, initialSource !== undefined],
            source,
        );
    
        return [
            result,
            invoke,
            taking,
        ]
    }
}