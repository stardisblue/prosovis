import { RootState } from '../../reducers';
import { createSelector } from '@reduxjs/toolkit';

export const selectActorsData = (state: RootState) => state.actorData;

export const selectActors = createSelector(
  selectActorsData,
  (actors) => actors.actors?.index
);
