import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PrimaryKey } from '../data';

export const filterSlice = createSlice({
  name: 'filters',
  initialState: {} as { [k: string]: any },
  reducers: {
    setFilter: {
      reducer(state, action: PayloadAction<{ key: PrimaryKey; filter: any }>) {
        state[action.payload.key] = action.payload.filter;
      },
      prepare(key: PrimaryKey, filter: any) {
        return { payload: { key, filter } };
      }
    }
  }
});

export const { setFilter } = filterSlice.actions;

export default filterSlice.reducer;
