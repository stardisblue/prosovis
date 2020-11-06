import { RootState } from '../../reducers';
import { createSelector } from '@reduxjs/toolkit';
import {
  LocalisationModel,
  RichRequiredLocalisation,
} from '../LocalisationModel';
import { filter } from 'lodash/fp';

export const selectLocalisations = (state: RootState) => state.localisationData;

export const selectLocalisationsModel = createSelector(
  selectLocalisations,
  (locs) => {
    if (locs.localisations) {
      return new LocalisationModel(locs.localisations);
    } else {
      return null;
    }
  }
);

export const selectMappableLocalisations = createSelector(
  selectLocalisationsModel,
  (model) =>
    filter(
      (v) =>
        v.localisation !== null &&
        v.localisation.lat !== null &&
        v.localisation.lng !== null,
      model?.getAll()
    ) as RichRequiredLocalisation[]
);
