import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PrimaryKey } from '../data';

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
