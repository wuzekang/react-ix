import { ProjectFunction } from '../types';
import { useTakeWith } from '../useTakeWith';
import { takeEvery } from '../operators/takeEvery';

export function useTakeEvery<T, R>(project: ProjectFunction<T, R>, concurrent?: number) {
    return useTakeWith<T, R>((project) => takeEvery(project, concurrent))(project);
}