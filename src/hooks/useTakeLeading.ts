import { ProjectFunction } from '../types';
import { takeLeading } from '../operators/takeLeading';
import { useTakeWith } from '../useTakeWith';

export function useTakeLeading<T, R>(project: ProjectFunction<T, R>) {
    return useTakeWith<T, R>(takeLeading)(project);
}