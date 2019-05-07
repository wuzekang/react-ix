import { useTakeWith } from '../useTakeWith';
import { takeLatest } from '../operators/takeLatest';

export const useTakeLatest = <T, R>() => useTakeWith<T, R>(takeLatest);