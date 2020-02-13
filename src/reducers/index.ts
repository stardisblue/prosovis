import { combineReducers } from '@reduxjs/toolkit';
import events from '../app/eventSlice';
import highlights from './highlightSlice';
import selection from './selectionSlice';
const rootReducer = combineReducers({
  events,
  highlights,
  selection
  // TODO : WIP mask
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
