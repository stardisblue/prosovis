import { createAction, createStandardAction } from 'typesafe-actions';

const ADD_ITEM = 'add-item';
const REMOVE_ITEM = 'remove-item';
const CLEAR_SELECTION = 'clear-selection';
const SELECT_ITEM = 'select-item';

export const add = createAction(ADD_ITEM, resolve => (payload: string) =>
  resolve(payload)
);

export const remove = createAction(REMOVE_ITEM, resolve => (payload: string) =>
  resolve(payload)
);

export const clear = createAction(CLEAR_SELECTION);

export const only = createAction(SELECT_ITEM, resolve => (payload: string) =>
  resolve(payload)
);
