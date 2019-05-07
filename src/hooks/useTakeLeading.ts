import { useTakeWith } from '../useTakeWith';
import { takeLeading } from '../operators/takeLeading';

export const useTakeLeading = <T, R>() => useTakeWith<T, R>(takeLeading);