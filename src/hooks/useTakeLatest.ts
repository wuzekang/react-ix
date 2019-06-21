import { ProjectFunction } from '../types';
import { takeLatest } from '../operators/takeLatest';
import { useTakeWith } from '../useTakeWith';

export function useTakeLatest<T, R>(project: ProjectFunction<T, R>) {
    return useTakeWith<T, R>(takeLatest)(project);
}