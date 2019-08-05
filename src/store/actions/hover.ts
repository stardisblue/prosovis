import { createAction, createStandardAction } from 'typesafe-actions';

const BEGIN = 'begin-hover';
const END = 'end-hover';

export const begin = createAction(BEGIN, resolve => (payload: string) =>
  resolve(payload)
);

export const end = createAction(END);
