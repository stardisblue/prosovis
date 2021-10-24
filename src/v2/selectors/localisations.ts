import { RootState } from '../../reducers';

export const selectLocalisations = (state: RootState) =>
  state.localisationData.localisations;
