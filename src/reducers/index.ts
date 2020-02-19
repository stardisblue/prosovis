import { combineReducers } from '@reduxjs/toolkit';
import events from './eventSlice';
import highlights from './highlightSlice';
import selection from './selectionSlice';
import mask from './maskSlice';
import color from './colorSlice';
import timelineGroup from '../feature/timeline/timelineGroupSlice';
const rootReducer = combineReducers({
  color,
  events,
  highlights,
  selection,
  mask,
  timelineGroup
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
