import { combineReducers } from '@reduxjs/toolkit';
import events from '../app/eventSlice';
import highlights from '../app/highlightSlice';
import selection from '../app/selectionSlice';
import filters from '../app/filterSlice';
const rootReducer = combineReducers({
  events,
  highlights,
  selection,
  filters
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
