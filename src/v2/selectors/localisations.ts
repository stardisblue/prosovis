import { RootState } from '../../reducers';
import { createSelector } from '@reduxjs/toolkit';

export const selectLocalisations = (state: RootState) => state.localisationData;

export const selectLocalisationsIndex = createSelector(
  selectLocalisations,
  (locs) => locs.localisations
);
