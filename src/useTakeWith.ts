import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { useObservable } from 'rxjs-hooks';
import { useState } from 'react';

import { ProjectFunction, Optional, TakeOperator } from './types'

type Source<T, R> = [T, Optional<Subject<R>>];

export const useTakeWith = <T, R>(strategy: TakeOperator<Source<T, R>, Optional<R>>) => 
    (project: ProjectFunction<T, R>, initialSource: T, initialResult?: R): [(source: T) => Subject<R>, Optional<R>, boolean] => {
    
        const [source, setSource] = useState<Source<T, R>>([initialSource, undefined]);

        const [result, taking] = useObservable<[Optional<R>, boolean], Source<T, R>>(
            query$ => query$.pipe(
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
            [initialResult, true],
            source,
        );

        return [
            (source: T) => {
                const notifier = new Subject<R>()
                setSource([source, notifier])
                return notifier;
            },
            result,
            taking,
        ]
    }