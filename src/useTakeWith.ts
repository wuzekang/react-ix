import { useState, useMemo } from 'react';
import { Subject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { useObservable } from 'rxjs-hooks';
import { OperatorFunction } from 'rxjs/internal/types';

import { ProjectFunction, Optional, TakeOperator } from './types'

type Source<T, R> = [T, Optional<Subject<R>>];

export const useTakeWith = <T, R>(strategy: TakeOperator<Source<T, R>, Optional<R>>) => 
    (project: ProjectFunction<T, R>) =>
        (initialSource: T, initialResult?: R): [R | undefined, (source: T) => Subject<R>, boolean] => {
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
                    strategy(
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