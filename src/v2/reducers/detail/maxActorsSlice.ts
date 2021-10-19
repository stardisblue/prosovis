import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const detailMaxActors = createSlice({
  initialState: { max: 5, current: null } as {
    max: number;
    current: null | string;
  },
  name: 'detail/max-actors',
  reducers: {
    setMaxActors(state, action: PayloadAction<number>) {
      state.max = action.payload; // immerjs
    },
    setCurrent(state, action: PayloadAction<string>) {
      state.current = action.payload;
    },

    resetCurrent(state) {
      state.current = null;
    },
  },
});

export default detailMaxActors.reducer;
export const { setMaxActors, setCurrent, resetCurrent } =
  detailMaxActors.actions;
