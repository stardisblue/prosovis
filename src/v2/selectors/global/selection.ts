import { createSelector } from 'reselect';
import { RootState } from '../../../reducers';
import { createInteractionMap } from './utils';

export const selectGlobalSelection = (state: RootState) =>
  state.globalSelectionSlice;

// export const selectGlobalSelectionMap = createSelector(
//   selectGlobalSelection,
//   createInteractionMap
// );
