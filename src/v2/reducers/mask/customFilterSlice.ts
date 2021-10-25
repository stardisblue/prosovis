import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { identity, isNil, keyBy } from 'lodash/fp';

const initialState: _.Dictionary<_.Dictionary<string | null>> = {};

export const customFilterSlice = createSlice({
  name: 'custom-filter',
  initialState,
  reducers: {
    add(state, { payload: [value, dict] }: PayloadAction<[string, string[]]>) {
      state[value] = keyBy<string>(identity, dict);
    },
    remove(state, { payload }: PayloadAction<string>) {
      delete state[payload];
    },
    toggle(state, { payload: [key, value] }: PayloadAction<[string, string]>) {
      if (state[key]) {
        if (isNil(state[key][value])) state[key][value] = value;
        else state[key][value] = null;
      }
    },
  },
});

export default customFilterSlice.reducer;
export const {
  add: addCustomFilter,
  remove: removeCustomFilter,
  toggle: toggleCustomFilter,
} = customFilterSlice.actions;
