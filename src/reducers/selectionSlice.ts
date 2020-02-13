import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PrimaryKey } from '../data';
import _ from 'lodash';
import { RootState } from '.';

const selectionSlice = createSlice({
  name: 'selection',
  initialState: null as PrimaryKey[] | null,
  reducers: {
    setSelection: {
      prepare(value?: PrimaryKey[] | PrimaryKey) {
        if (value === undefined) return { payload: null };
        if (Array.isArray(value))
          return {
            payload: _(value)
              .sort()
              .sortedUniq()
              .value()
          };
        else return { payload: [value] };
      },
      reducer(_state, action: PayloadAction<PrimaryKey[] | null>) {
        return action.payload;
      }
    },
    addSelection(state, action: PayloadAction<PrimaryKey | PrimaryKey[]>) {
      // if state exists , add to state
      if (state) {
        if (Array.isArray(action.payload)) {
          return state.concat(action.payload);
        }
        state.push(action.payload);
      }

      if (Array.isArray(action.payload)) return action.payload;
      // otherwise, add as new
      else return [action.payload];
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

export const selectSelection = (state: RootState) => state.selection;
