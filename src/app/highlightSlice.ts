import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PrimaryKey } from '../data';

type HightlightEvent = { id: PrimaryKey; kind: string };
type HightlightEvents = HightlightEvent[];

export const highlightSlice = createSlice({
  name: 'highlight',
  initialState: null as HightlightEvents | null,
  reducers: {
    setHighlights(state, action: PayloadAction<HightlightEvents>) {
      return action.payload;
    },
    clearHighlights(state) {
      return null;
    }
  }
});

export const { setHighlights, clearHighlights } = highlightSlice.actions;

export default highlightSlice.reducer;
