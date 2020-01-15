import { combineReducers } from '@reduxjs/toolkit';
import events from '../app/eventSlice';
import highlights from './highlightSlice';
import selection from './selectionSlice';
import filters from './filterSlice';
const rootReducer = combineReducers({
  events,
  highlights,
  selection,
  filters
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
