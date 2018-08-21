import { PureComponent, ReactNode, ComponentClass } from 'react';

import { Subject, merge, empty, BehaviorSubject, combineLatest, Observable, MonoTypeOperatorFunction } from 'rxjs';

import {
  withLatestFrom,
  filter,
  mapTo,
  startWith,
  switchMap,
  mergeMap,
  switchAll,
  scan,
  map,
  share,
  count,
  tap,
} from 'rxjs/operators';

const filterEq = v => filter(x => x === v);

export interface IX<P> {
  loading: <T, R>(params$: Observable<T>, loader: (params: T) => Observable<R>) => [Observable<R>, Observable<boolean>],
  debug: <T>(name: string, ...options: any[]) => MonoTypeOperatorFunction<T>
  event: <T>(name: string) => Subject<T>,
  lifecycle: Subject<string>,
  dispatch: <T>(name: string) => (payload: T) => void,
  connect: <T>(source: Observable<T>) => Observable<T>,
  handle: <T>(name: string) => (event: T) => void,
  props: BehaviorSubject<P>,
}

interface S {
  element: ReactNode
}

export const component = <P>(displayName: string, fn: (ix: IX<P>) => Observable<ReactNode>) => {
  class Cycle extends PureComponent<P, S> {
    public static displayName: string = displayName;
    private static counter = 0;
    private events$;
    private lifecycle;
    private ix: IX<P>;
    private element$: BehaviorSubject<ReactNode>;


    private id = (Cycle.counter += 1);

    constructor(props, context) {
      super(props, context);

      this.events$ = {};

      this.lifecycle = new Subject();

      const dispatch$ = new Subject<{ type, payload }>();

      const mounted$ = merge(
        this.lifecycle.pipe(
          filterEq('didMount'),
          mapTo(true)
        ),
        this.lifecycle.pipe(
          filterEq('willUnmount'),
          mapTo(false)
        )
      ).pipe(startWith(false));

      const ix: IX<P> = {
        loading: <T,R>(params$: Observable<T>, loader: (params: T) => Observable<R>) =>
          loading<T,R>(params$, loader)
            .map(ix.connect) as [Observable<R>, Observable<boolean>],
        debug: (name, ...options) => o =>
        o.pipe(
          tap(
            value =>
              /* eslint-disable-next-line no-console */
              console.log(
                '%c(next)',
                'color:blue',
                `${displayName}#${this.id} ${name}`,
                value,
                ...options
              ),
            error =>
              /* eslint-disable-next-line no-console */
              console.log(
                '%c(error)',
                'color:red',
                `${displayName}#${this.id} ${name}`,
                error,
                ...options
              ),
            () =>
              /* eslint-disable-next-line no-console */
              console.log(
                '%c(complete)',
                'color:green',
                `${displayName}#${this.id} ${name}`,
                ...options
              )
          ),
          share()
        ),
        event: name => {
          const event$ = this.events$[name] || new Subject();
          this.events$[name] = event$;
          return event$;
        },
        lifecycle: this.lifecycle,
        connect: event$ => mounted$.pipe(switchMap(mounted => (mounted ? event$ : empty()))),
        props: new BehaviorSubject(props),
        dispatch: (type = 'dispatch') => payload => dispatch$.next({ type, payload }),
        handle: name => event => this.ix.event(name).next(event),
      };

      this.ix = ix;

      dispatch$.pipe(withLatestFrom(this.ix.props)).subscribe(([{ type, payload }, props]) => {
        if (typeof props[type] === 'function') {
          props[type](payload);
        }
      });

      this.element$ = new BehaviorSubject(null);

      fn(this.ix).subscribe(this.element$);

      this.state = {
        element: this.element$.value,
      };

      this.ix.connect(this.element$).subscribe(element => this.setState({ element }));
    }

    componentDidMount() {
      this.lifecycle.next('didMount');
    }

    componentWillReceiveProps(props) {
      this.lifecycle.next('willReceiveProps');
      this.ix.props.next(props);
    }

    componentWillUnmount() {
      this.lifecycle.next('willUnmount');
      this.lifecycle.complete();
    }

    render() {
      return this.state.element;
    }
  }
  
  return Cycle as ComponentClass<P,S>;
};

const loading = <T, R>(params$: Observable<T>, loader: (params: T) => Observable<R>): [Observable<R>, Observable<boolean>] => {
  const loader$ = params$.pipe(
    map(params => loader(params).pipe(share())),
    share()
  );

  return [
    loader$.pipe(
      switchAll<R>(),
      share()
    ),
    combineLatest(
      loader$.pipe(map((_, i) => i + 1)),
      loader$.pipe(
        switchMap((o, i) =>
          o.pipe(
            count(),
            mapTo(i + 1)
          )
        ),
        startWith(0)
      )
    ).pipe(
      map(([start, end]) => end < start),
      startWith(false)
    ),
  ];
};
