import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isArray } from 'lodash/fp';

export type SuperHightlightEvent = {
  id: string;
  kind: string;
  type?: string;
};

export const superHighlightSlice = createSlice({
  name: 'super-highlight',
  initialState: null as SuperHightlightEvent[] | null,
  reducers: {
    setSuperHighlights(
      _state,
      action: PayloadAction<SuperHightlightEvent | SuperHightlightEvent[]>
    ) {
      return isArray(action.payload) ? action.payload : [action.payload];
    },
    clearSuperHighlights() {
      return null;
    },
  },
});

export const { setSuperHighlights, clearSuperHighlights } =
  superHighlightSlice.actions;

export default superHighlightSlice.reducer;
