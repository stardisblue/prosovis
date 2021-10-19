import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../reducers';
import { selectDetailRelations } from './selectRelations';
import { Emphase } from './models';
import { selectRelationSelection } from './selectionSlice';
import { parseEmphase } from './utils/emphase';

export const highlightSlice = createSlice({
  name: 'relation/highlight',
  initialState: null as Emphase | null,
  reducers: {
    setRelationHighlight(_, action: PayloadAction<Emphase>) {
      return action.payload;
    },
    clearRelationHighligh() {
      return null;
    },
  },
});

export const selectRelationHighlights = (state: RootState) =>
  state.relationHighlight;
export const selectHighlightedGhosts = createSelector(
  selectDetailRelations,
  selectRelationHighlights,
  parseEmphase
);

export const selectRelationEmphasis = createSelector(
  selectRelationSelection,
  selectRelationHighlights,
  (rel, high) => (rel ? rel : high)
);

export const { setRelationHighlight, clearRelationHighligh } =
  highlightSlice.actions;

export default highlightSlice.reducer;
