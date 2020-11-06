import { RootState } from '../../reducers';
import { createSelector } from '@reduxjs/toolkit';
import { selectActorsModel } from './actors';
import { selectLocalisationsModel } from './localisations';
import { EventModel } from '../EventModel';

export const selectEvents = (state: RootState) => state.eventData;

export const selectEventsModel = createSelector(
  selectEvents,
  selectActorsModel,
  selectLocalisationsModel,
  (evs, actorModel, locModel) => {
    if (evs.events && actorModel && locModel) {
      return new EventModel(evs.events, actorModel, locModel);
    } else {
      return null;
    }
  }
);

export const selectAllEvents = createSelector(selectEventsModel, (model) =>
  model?.getAll()
);
