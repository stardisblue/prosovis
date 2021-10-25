import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// TODO groupby

const switchSlice = createSlice({
  name: 'switch',
  initialState: 'Kind' as 'Actor' | 'Kind',
  reducers: {
    toggleSwitch(state) {
      return state === 'Actor' ? 'Kind' : 'Actor';
    },
    switchToActor() {
      return 'Actor';
    },
    switchToKind() {
      return 'Kind';
    },
    switchTo(_state, { payload }: PayloadAction<'Actor' | 'Kind'>) {
      return payload;
    },
  },
});

export default switchSlice.reducer;

export const { toggleSwitch, switchTo, switchToActor, switchToKind } =
  switchSlice.actions;
