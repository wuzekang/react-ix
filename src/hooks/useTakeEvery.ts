import { useTakeWith } from '../useTakeWith';
import { takeEvery } from '../operators/takeEvery';

export const useTakeEvery = useTakeWith(takeEvery);