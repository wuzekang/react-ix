import React from 'react';

import { Subject, merge, empty, BehaviorSubject, combineLatest } from 'rxjs';

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

export const component = (displayName, process) => {
  class Cycle extends React.PureComponent {
    static counter = 0;

    id = (Cycle.counter += 1);

    constructor(props) {
      super();

      this.events$ = {};

      this.lifecycle = new Subject();

      const dispatch$ = new Subject();

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

      this.props$ = new BehaviorSubject(null);

      process(this.ix).subscribe(this.props$);

      this.state = {
        props: this.props$.value,
      };

      this.ix.connect(this.props$).subscribe(props => this.setState({ props }));
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
      return this.state.props;
    }
  }
  Cycle.displayName = displayName;
  return Cycle;
};

export const loading = (params$, loader) => {
  const response$ = params$.pipe(
    map(params => loader(params)),
    share()
  );

  return [
    response$.pipe(
      switchAll(),
      share()
    ),
    combineLatest(
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
  ];
};
