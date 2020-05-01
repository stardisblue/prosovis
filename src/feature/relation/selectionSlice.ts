import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../reducers';
import { selectRelations } from './selectRelations';
import { parseEmphase } from './utils/emphase';
import { Emphase } from './models';

export const selectionSlice = createSlice({
  name: 'relation/selection',
  initialState: null as Emphase | null,
  reducers: {
    setRelationSelection(_, action: PayloadAction<Emphase>) {
      return action.payload;
    },
    clearRelationSelection() {
      return null;
    },
  },
});

export const selectRelationSelection = (state: RootState) =>
  state.relationSelection;

export const selectSelectedGhosts = createSelector(
  selectRelations,
  selectRelationSelection,
  parseEmphase
);

export const {
  setRelationSelection,
  clearRelationSelection,
} = selectionSlice.actions;

export default selectionSlice.reducer;
