import { RootState } from '../../reducers';
import { createSelector } from '@reduxjs/toolkit';
import { ActorModel } from '../models/ActorModel';

export const selectActors = (state: RootState) => state.actorData;

export const selectActorsModel = createSelector(selectActors, (act) =>
  act.actors ? new ActorModel(act.actors) : null
);
