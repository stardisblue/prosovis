import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PrimaryKey } from '../data';

export const maxActorsSlice = createSlice({
  initialState: { max: 5, current: null } as {
    max: number;
    current: null | PrimaryKey;
  },
  name: 'max-actors',
  reducers: {
    setMaxActors(state, action: PayloadAction<number>) {
      state.max = action.payload; // immerjs
    },
    setCurrent(state, action: PayloadAction<PrimaryKey>) {
      state.current = action.payload;
    },

    resetCurrent(state) {
      state.current = null;
    },
  },
});

export default maxActorsSlice.reducer;
export const {
  setMaxActors,
  setCurrent,
  resetCurrent,
} = maxActorsSlice.actions;
