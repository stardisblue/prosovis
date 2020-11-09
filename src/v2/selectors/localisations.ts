import { RootState } from '../../reducers';
import { createSelector } from '@reduxjs/toolkit';
import { LocalisationModel } from '../models/LocalisationModel';

export const selectLocalisations = (state: RootState) => state.localisationData;

export const selectLocalisationsModel = createSelector(
  selectLocalisations,
  (locs) =>
    locs.localisations ? new LocalisationModel(locs.localisations) : undefined
);

export const selectMappableLocalisations = createSelector(
  selectLocalisationsModel,
  (model) => model?.getAllLocalised()
);
