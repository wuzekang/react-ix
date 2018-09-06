
import { throttleTime, map } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';
import { takeLatest } from '../../src/operators/takeLatest';

const scheduler = new TestScheduler((actual, expected) => {
  expect(expected).toEqual(actual)
});

it('takeLatest correctly', () => {
  scheduler.run(({ cold, expectObservable, expectSubscriptions }) => {
    const e1 = cold(
        '-a--b--c-----|'
    );

    const e1subs = 
        '^------------!';

    const e2 = cold(
        '---a|'
    );

    const e2subs = [
        '-^--!',
        '----^--!',
        '-------^---!'
    ]

    const expected = [
        '----------a--|',
        'ft--t--t---f-|',
    ];

    const result = takeLatest(() => e2)(e1)

    expectObservable(result[0]).toBe(expected[0]);
    expectObservable(result[1].pipe(map(value => value ? 't' : 'f'))).toBe(expected[1]);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
    expectSubscriptions(e2.subscriptions).toBe(e2subs);
  });
});