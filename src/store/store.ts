import { combineReducers } from 'redux';
import items, { DataState } from './reducers/items';
import selection, { SelectionState } from './reducers/selection';
import hover, { HoverState } from './reducers/hover';

export type DataStore = {
  items: DataState;
  selection: SelectionState;
  hover: HoverState;
};

export default combineReducers({ items, selection, hover });
