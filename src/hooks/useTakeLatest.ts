import { useTakeWith } from '../useTakeWith';
import { takeLatest } from '../operators/takeLatest';

export const useTakeLatest = useTakeWith(takeLatest);