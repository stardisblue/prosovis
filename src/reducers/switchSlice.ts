import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';

const switchSlice = createSlice({
  name: 'switch',
  initialState: 'Actor' as 'Actor' | 'Kind',
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
    }
  }
});

export default switchSlice.reducer;

export const {
  toggleSwitch,
  switchTo,
  switchToActor,
  switchToKind
} = switchSlice.actions;

export const selectSwitch = (state: RootState) => state.switch;
