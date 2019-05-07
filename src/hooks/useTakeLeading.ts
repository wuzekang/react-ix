import { useTakeWith } from '../useTakeWith';
import { takeLeading } from '../operators/takeLeading';

export const useTakeLeading = useTakeWith(takeLeading);