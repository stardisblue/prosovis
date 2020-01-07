import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PrimaryKey } from '../data';
import _ from 'lodash';

const selectionSlice = createSlice({
  name: 'selection',
  initialState: null as PrimaryKey[] | null,
  reducers: {
    select: {
      reducer(_state, action: PayloadAction<PrimaryKey[] | null>) {
        return action.payload;
      },
      prepare(value?: PrimaryKey[]) {
        if (value === undefined) return { payload: null };

        return {
          payload: _(value)
            .sort()
            .sortedUniq()
            .value()
        };
      }
    }
  }
});

export const { select } = selectionSlice.actions;

export default selectionSlice.reducer;
