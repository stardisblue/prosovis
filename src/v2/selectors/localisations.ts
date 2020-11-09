import { RootState } from '../../reducers';
import { createSelector } from '@reduxjs/toolkit';
import {
  LocalisationModel,
  RichRequiredLocalisation,
} from '../models/LocalisationModel';
import { filter } from 'lodash/fp';

export const selectLocalisations = (state: RootState) => state.localisationData;

export const selectLocalisationsModel = createSelector(
  selectLocalisations,
  (locs) =>
    locs.localisations ? new LocalisationModel(locs.localisations) : null
);

export const selectMappableLocalisations = createSelector(
  selectLocalisationsModel,
  (model) => model?.getAllLocalised()
);
