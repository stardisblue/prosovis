import { createSlice, PayloadAction } from '@reduxjs/toolkit';
type IntervalMask = {
  start: number;
  end: number;
};

const maskGlobalTimeSlice = createSlice({
  name: 'mask-global-time',
  initialState: null as IntervalMask | null,
  reducers: {
    set(
      _state,
      { payload: { start, end } }: PayloadAction<{ start: Date; end: Date }>
    ) {
      return { start: +start, end: +end };
    },
    clear() {
      return null;
    },
  },
});

export default maskGlobalTimeSlice.reducer;
export const {
  set: setMaskGlobalTime,
  clear: clearMaskGlobalTime,
} = maskGlobalTimeSlice.actions;
