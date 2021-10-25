import { combineReducers } from '@reduxjs/toolkit';
import highlights from './highlightSlice';
import selection from './selectionSlice';
import mask from './maskSlice';
import color from './colorSlice';
import timelineGroup from '../feature/timeline/timelineGroupSlice';
import SwitchReducer from './switchSlice';
import superHighlight from './superHighlightSlice';
import relationSelection from '../feature/relation/selectionSlice';
import relationHighlight from '../feature/relation/highlightSlice';
import actorData from '../v2/reducers/actorsDataSlice';
import localisationData from '../v2/reducers/localisationsDataSlice';
import eventData from '../v2/reducers/eventsDataSlice';
import graphData from '../v2/reducers/graphDataSlice';
import relationsData from '../v2/reducers/relationsDataSlice';
import customFilter from '../v2/reducers/mask/customFilterSlice';
import maskGlobalTime from '../v2/reducers/mask/globalTimeSlice';
import maskGlobalMapBounds from '../v2/reducers/mask/globalMapBoundsSlice';
import globalHighlight from '../v2/reducers/global/highlightSlice';
import globalSelection from '../v2/reducers/global/selectionSlice';
import actorSummary from '../v2/reducers/global/actorSummarySlice';
import detailActors from '../v2/reducers/detail/actorSlice';
import maxActors from '../v2/reducers/detail/maxActorsSlice';

const rootReducer = combineReducers({
  maxActors,
  color,
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
  maskGlobalTime,
  maskGlobalMapBounds,
  globalHighlight,
  globalSelection,
  actorSummary,
  detailActors,
  customFilter,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
