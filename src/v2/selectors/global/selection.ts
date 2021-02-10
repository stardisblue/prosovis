import { RootState } from '../../../reducers';

export const selectGlobalSelection = (state: RootState) =>
  state.globalSelectionSlice;

// export const selectGlobalSelectionMap = createSelector(
//   selectGlobalSelection,
//   createInteractionMap
// );
