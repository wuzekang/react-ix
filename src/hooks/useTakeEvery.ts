import { useTakeWith } from '../useTakeWith';
import { takeEvery } from '../operators/takeEvery';

export const useTakeEvery = <T, R>() => useTakeWith<T, R>(takeEvery);