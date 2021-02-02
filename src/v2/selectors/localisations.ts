import { RootState } from '../../reducers';
import { createSelector } from '@reduxjs/toolkit';

export const selectLocalisations = (state: RootState) => state.localisationData;

export const selectLocalisationsModel = createSelector(
  selectLocalisations,
  (locs) => locs.localisations?.index
);

export const selectMappableLocalisations = createSelector(
  selectLocalisationsModel,
  (model) => undefined
);
