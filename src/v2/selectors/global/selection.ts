import { RootState } from '../../../reducers';

export const selectGlobalSelection = (state: RootState) =>
  state.globalSelection;

// export const selectGlobalSelectionMap = createSelector(
//   selectGlobalSelection,
//   createInteractionMap
// );
