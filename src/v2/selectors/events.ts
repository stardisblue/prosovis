import { RootState } from '../../reducers';
import { createSelector } from '@reduxjs/toolkit';
import { selectActorsModel } from './actors';
import { selectLocalisationsModel } from './localisations';
import { EventModel } from '../models/EventModel';
import { flatMap, identity, keyBy, map, pipe, uniqBy } from 'lodash/fp';

export const selectEvents = (state: RootState) => state.eventData;

export const selectEventsModel = createSelector(
  selectEvents,
  selectActorsModel,
  selectLocalisationsModel,
  (evs, actorModel, locModel) =>
    evs.events && actorModel && locModel
      ? new EventModel(evs.events, actorModel, locModel)
      : undefined
);

export const selectAllEvents = createSelector(selectEventsModel, (m) =>
  m ? flatMap(map(m.get), m.source.index) : undefined
);

export const selectAllKinds = createSelector(selectAllEvents, (all) =>
  all
    ? pipe(
        uniqBy<typeof all[0]>('value.kind'),
        map('value.kind'),
        keyBy(identity)
      )(all)
    : undefined
);

export const selectDateExtent = createSelector(selectAllEvents, (all) => {
  return null;
});

// function optional<T extends any>(callback: ){
//   return function()value ? value : value
// }
