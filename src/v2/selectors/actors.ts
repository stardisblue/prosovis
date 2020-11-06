import { RootState } from '../../reducers';
import { createSelector } from '@reduxjs/toolkit';
import { ActorModel } from '../ActorModel';

export const selectActors = (state: RootState) => state.actorData;

export const selectActorsModel = createSelector(selectActors, (act) => {
  if (act.actors) {
    return new ActorModel(act.actors);
  } else {
    return null;
  }
});
