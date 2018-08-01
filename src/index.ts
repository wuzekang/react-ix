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

export const component = <P>(displayName: string, fn:(ix: IX<P>) => Observable<ReactNode>) => {

  const Cycle: ComponentClass<P,S> = class Cycle extends PureComponent<P,S> {
    private static counter = 0;
    static displayName: string = displayName;

    private events$;
    private lifecycle;
    private ix: IX<P>;
    private element$: BehaviorSubject<ReactNode>;

  
    private id = (Cycle.counter += 1);

    constructor(props, context) {
      super(props, context);

      this.events$ = {};

      this.lifecycle = new Subject();

      const dispatch$ = new Subject<{type, payload}>();

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

      this.ix = {
        debug: (name, ...options) => o =>
          o.pipe(
            /* eslint-disable-next-line no-console */
            tap(v => console.log(`${displayName}#${this.id} ${name}`, ...options, v)),
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
  return Cycle;
};

export const loading = <T,R>(params$: Observable<T>, loader: (params:T) => Observable<R>) => {
  const response$ = params$.pipe(
    map(params => loader(params)),
    share()
  );

  return {
    response$: response$.pipe(
      switchAll<R>(),
      share()
    ),
    loading$: combineLatest(
      params$.pipe(map((params, i) => i)),
      response$.pipe(
        mergeMap((o, i) =>
          o.pipe(
            count(),
            mapTo(i)
          )
        ),
        scan((acc, value) => Math.max(acc, value), 0)
      )
    ).pipe(
      map(([start, end]) => end < start),
      startWith(false)
    ),
  };
};
