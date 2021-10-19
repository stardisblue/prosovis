import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';

type HightlightEvent = { id: string; kind: string; type?: string };

export const highlightSlice = createSlice({
  name: 'highlight',
  initialState: null as HightlightEvent[] | null,
  reducers: {
    setHighlights(
      _state,
      action: PayloadAction<HightlightEvent | HightlightEvent[]>
    ) {
      return _.isArray(action.payload) ? action.payload : [action.payload];
    },
    clearHighlights() {
      return null;
    },
  },
});

export const { setHighlights, clearHighlights } = highlightSlice.actions;

export default highlightSlice.reducer;
