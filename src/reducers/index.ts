import { combineReducers } from '@reduxjs/toolkit';
import events from './eventSlice';
import highlights from './highlightSlice';
import selection from './selectionSlice';
import mask from './maskSlice';
import color from './colorSlice';
import timelineGroup from '../feature/timeline/timelineGroupSlice';
import SwitchReducer from './switchSlice';
import superHighlight from './superHighlightSlice';
const rootReducer = combineReducers({
  color,
  events,
  highlights,
  selection,
  mask,
  timelineGroup,
  switch: SwitchReducer,
  superHighlight
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
