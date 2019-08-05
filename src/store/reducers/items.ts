import { createReducer } from 'typesafe-actions';

// TODO
export type Item = object & { id: string };

export type DataState = { [key: string]: Item };

let initialState: DataState = {
  yolo: { id: 'yolo' }
};

export function store(state: DataState = initialState) {
  return state;
}

export default createReducer(store);
