import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { pickBy } from 'lodash/fp';

const initialState: _.Dictionary<string> = {};

const actorDataSlice = createSlice({
  name: 'globalKindMask',
  initialState,
  reducers: {
    add(state, { payload }: PayloadAction<string>) {
      return { ...state, [payload]: payload };
    },
    remove(state, { payload }: PayloadAction<string>) {
      return pickBy((v) => v !== payload, state);
    },
    toggle(state, { payload }: PayloadAction<string>) {
      if (state[payload]) {
        return pickBy((v) => v !== payload, state);
      } else {
        return { ...state, [payload]: payload };
      }
    },
  },
});

export default actorDataSlice.reducer;
export const { toggle: toggleKindMask } = actorDataSlice.actions;
