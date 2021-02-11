import { createSelector } from 'reselect';
import { RootState } from '../../../reducers';
import { createInteractionMap } from './utils';

export const selectGlobalHighlight = (state: RootState) =>
  state.globalHighlight;

export const selectGlobalHighlightMap = createSelector(
  selectGlobalHighlight,
  createInteractionMap
);
