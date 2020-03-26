import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PrimaryKey } from '../data';
import _ from 'lodash';

export type SelectionEvent = { id: PrimaryKey; kind: string; type?: string };

const selectionSlice = createSlice({
  name: 'selection',
  initialState: null as SelectionEvent[] | null,
  reducers: {
    setSelection(
      _state,
      action: PayloadAction<SelectionEvent | SelectionEvent[]>
    ) {
      if (_.isArray(action.payload))
        return _(action.payload)
          .sortBy('id')
          .sortedUniqBy('id')
          .value();
      else return [action.payload];
    },
    addSelection(
      state,
      action: PayloadAction<SelectionEvent | SelectionEvent[]>
    ) {
      // if state exists , add to state
      if (_.isArray(action.payload)) {
        return state ? state.concat(action.payload) : action.payload;
      } else {
        if (state) state.push(action.payload);
        else return [action.payload];
      }
    },
    clearSelection() {
      return null;
    }
  }
});

export const {
  setSelection,
  addSelection,
  clearSelection
} = selectionSlice.actions;

export default selectionSlice.reducer;
