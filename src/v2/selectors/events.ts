import { RootState } from '../../reducers';
import { createSelector } from '@reduxjs/toolkit';
import { selectActorsModel } from './actors';
import { selectLocalisationsModel } from './localisations';
import { EventModel } from '../models/EventModel';

export const selectEvents = (state: RootState) => state.eventData;

export const selectEventsModel = createSelector(
  selectEvents,
  selectActorsModel,
  selectLocalisationsModel,
  (evs, actorModel, locModel) =>
    evs.events && actorModel && locModel
      ? new EventModel(evs.events, actorModel, locModel)
      : null
);

export const selectAllEvents = createSelector(selectEventsModel, (model) =>
  model?.getAll()
);
