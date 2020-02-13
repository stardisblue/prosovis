import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { PrimaryKey } from '../data';
import { RootState } from '.';
import _ from 'lodash';

type HightlightEvent = { id: PrimaryKey; kind: string };

export const highlightSlice = createSlice({
  name: 'highlight',
  initialState: null as HightlightEvent[] | null,
  reducers: {
    setHighlight(_, action: PayloadAction<HightlightEvent>) {
      return [action.payload];
    },
    setHighlights(_, action: PayloadAction<HightlightEvent[]>) {
      return action.payload;
    },
    clearHighlights() {
      return null;
    }
  }
});

export const {
  setHighlight,
  setHighlights,
  clearHighlights
} = highlightSlice.actions;

export default highlightSlice.reducer;

export const selectHighlights = (state: RootState) => state.highlights;

export const selectHighlightsAsMap = createSelector([selectHighlights], res =>
  _.keyBy(res, i => i.id)
);
