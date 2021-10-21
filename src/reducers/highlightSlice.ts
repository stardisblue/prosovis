import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isArray } from 'lodash/fp';

type HightlightEvent = { id: string; kind: string; type?: string };

export const highlightSlice = createSlice({
  name: 'highlight',
  initialState: null as HightlightEvent[] | null,
  reducers: {
    setHighlights(
      _state,
      action: PayloadAction<HightlightEvent | HightlightEvent[]>
    ) {
      return isArray(action.payload) ? action.payload : [action.payload];
    },
    clearHighlights() {
      return null;
    },
  },
});

export const { setHighlights, clearHighlights } = highlightSlice.actions;

export default highlightSlice.reducer;
