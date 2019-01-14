import { PureComponent, ReactNode, ComponentClass } from 'react';

import { Subject, merge, NEVER, EMPTY, BehaviorSubject, Observable, MonoTypeOperatorFunction } from 'rxjs';

import {
  withLatestFrom,
  share,
  tap,
  count,
  takeUntil,
  switchMap,
} from 'rxjs/operators';

export interface IX<P> {
  debug: <T>(name: string, ...options: any[]) => MonoTypeOperatorFunction<T>
  event: <T>(name: string) => Observable<T>,
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
    private events$ = {};
    private lifecycle = new Subject<string>();
    private ix: IX<P>;
    private element$ = new BehaviorSubject<ReactNode>(null);
    private mounted$ = new BehaviorSubject<boolean>(false);

    private id = (Cycle.counter += 1);

    constructor(props, context) {
      super(props, context);

      const dispatch$ = new Subject<{ type, payload }>();

      const completed$ = this.lifecycle.pipe(count());

      const ix: IX<P> = {
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
        lifecycle: this.lifecycle,
        connect: <T>(event$: Observable<T>) =>  merge<T>(event$, NEVER).pipe(takeUntil(completed$)),
        props: new BehaviorSubject(props),
        dispatch: (type = 'dispatch') => payload => dispatch$.next({ type, payload }),
        event: name => {
          const event$ = this.events$[name] || new Subject();
          this.events$[name] = event$;
          return ix.connect(event$);
        },
        handle: name => {
          const event$ = this.events$[name] || new Subject();
          this.events$[name] = event$;
          return event => event$.next(event);
        },
      };

      dispatch$.pipe(withLatestFrom(ix.props)).subscribe(([{ type, payload }, props]) => {
        if (typeof props[type] === 'function') {
          props[type](payload);
        }
      });

      this.element$ = new BehaviorSubject(null);

      fn(ix).subscribe(this.element$);

      this.state = {
        element: this.element$.value,
      };

      this.mounted$.pipe(switchMap(mounted => mounted ? this.element$ : EMPTY)).subscribe(element => this.setState({ element }));

      this.ix = ix;
    }

    componentDidMount() {
      this.lifecycle.next('didMount');
      this.mounted$.next(true);
    }

    componentWillReceiveProps(props) {
      this.lifecycle.next('willReceiveProps');
      this.ix.props.next(props);
    }

    componentWillUnmount() {
      this.lifecycle.next('willUnmount');
      this.mounted$.next(false);
      this.lifecycle.complete();
      this.mounted$.complete();
    }

    render() {
      return this.state.element;
    }
  }
  
  return Cycle as ComponentClass<P,S>;
};