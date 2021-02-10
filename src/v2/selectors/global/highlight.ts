import { RootState } from '../../../reducers';

export const selectGlobalHighlight = (state: RootState) =>
  state.globalHighlightSlice;

// export const selectGlobalHighlightMap = createSelector(
//   selectGlobalHighlight,
//   createInteractionMap
// );
