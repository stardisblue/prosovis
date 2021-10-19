import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isArray, pipe, sortBy, sortedUniqBy } from 'lodash/fp';

export type SelectionEvent = { id: string; kind: string; type?: string };

const selectionSlice = createSlice({
  name: 'selection',
  initialState: null as SelectionEvent[] | null,
  reducers: {
    setSelection(
      _state,
      { payload }: PayloadAction<SelectionEvent | SelectionEvent[]>
    ) {
      if (isArray(payload))
        return pipe(sortBy<SelectionEvent>('id'), sortedUniqBy('id'))(payload);
      else return [payload];
    },
    addSelection(
      state,
      { payload }: PayloadAction<SelectionEvent | SelectionEvent[]>
    ) {
      // if state exists , add to state
      if (isArray(payload)) {
        return state ? state.concat(payload) : payload;
      } else {
        if (state) state.push(payload);
        else return [payload];
      }
    },
    clearSelection() {
      return null;
    },
  },
});

export const { setSelection, addSelection, clearSelection } =
  selectionSlice.actions;

export default selectionSlice.reducer;
