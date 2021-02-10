import { combineReducers } from '@reduxjs/toolkit';
import events from './eventSlice';
import highlights from './highlightSlice';
import selection from './selectionSlice';
import mask from './maskSlice';
import color from './colorSlice';
import timelineGroup from '../feature/timeline/timelineGroupSlice';
import SwitchReducer from './switchSlice';
import superHighlight from './superHighlightSlice';
import relationSelection from '../feature/relation/selectionSlice';
import relationHighlight from '../feature/relation/highlightSlice';
import maxActors from './maxActorsSlice';
import serverStatus from './serverStatusSlice';
import actorData from '../v2/reducers/actorsDataSlice';
import localisationData from '../v2/reducers/localisationsDataSlice';
import eventData from '../v2/reducers/eventsDataSlice';
import graphData from '../v2/reducers/graphDataSlice';
import relationsData from '../v2/reducers/relationsDataSlice';
import maskKind from '../v2/reducers/mask/kindSlice';
import maskGlobalTime from '../v2/reducers/mask/globalTimeSlice';
import maskGlobalMapBounds from '../v2/reducers/mask/globalMapBoundsSlice';
import globalHighlightSlice from '../v2/reducers/global/highlightSlice';
import globalSelectionSlice from '../v2/reducers/global/selectionSlice';
const rootReducer = combineReducers({
  serverStatus,
  maxActors,
  color,
  events,
  highlights,
  selection,
  mask,
  timelineGroup,
  switch: SwitchReducer,
  superHighlight,
  relationSelection,
  relationHighlight,
  actorData,
  localisationData,
  eventData,
  graphData,
  relationsData,
  maskKind,
  maskGlobalTime,
  maskGlobalMapBounds,
  globalHighlightSlice,
  globalSelectionSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
