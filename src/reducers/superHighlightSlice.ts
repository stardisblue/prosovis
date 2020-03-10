import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PrimaryKey } from '../data';
import _ from 'lodash';

type SuperHightlightEvent = { id: PrimaryKey; kind: string; type?: string };

export const superHighlightSlice = createSlice({
  name: 'super-highlight',
  initialState: null as SuperHightlightEvent[] | null,
  reducers: {
    setSuperHightlights(
      _state,
      action: PayloadAction<SuperHightlightEvent | SuperHightlightEvent[]>
    ) {
      return _.isArray(action.payload) ? action.payload : [action.payload];
    },
    clearSuperHighlights() {
      return null;
    }
  }
});

export const {
  setSuperHightlights,
  clearSuperHighlights
} = superHighlightSlice.actions;

export default superHighlightSlice.reducer;
