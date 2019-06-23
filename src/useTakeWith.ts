import { useState, useMemo } from 'react';
import { of, Subject, Observable } from 'rxjs';
import { map, filter, tap, catchError } from 'rxjs/operators';
import { useObservable } from 'rxjs-hooks';
import { OperatorFunction } from 'rxjs/internal/types';

import { ProjectFunction, Optional, TakeOperator } from './types'

type Source<T, R> = [T, Optional<Subject<R>>];
type State<R> = [R | undefined, boolean, Error | undefined];

export const useTakeWith = <T, R>(strategy: TakeOperator<Source<T, R>, Optional<R>>) => 
    (project: ProjectFunction<T, R>) =>
        (initialSource: T, initialResult?: R): [R | undefined, (source: T) => Subject<R>, boolean, Error | undefined] => {
            const [source, setSource] = useState<[T | undefined, Subject<R> | undefined]>([initialSource, undefined]);

            const invoke = useMemo(() =>
                (source: T) => {
                    const notifier = new Subject<R>()
                    setSource([source, notifier])
                    return notifier;
                }, []
            );
        
            const [result, taking, error] = useObservable<State<R>, [T | undefined, Subject<R> | undefined]>(
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
                    map(([result, taking]) => [result, taking, undefined] as State<R>),
                    catchError((error: Error) => of([undefined, false, error]) as Observable<State<R>> ),
                ),
                [initialResult, initialSource !== undefined, undefined],
                source,
            );
        
            return [
                result,
                invoke,
                taking,
                error,
            ]
        }