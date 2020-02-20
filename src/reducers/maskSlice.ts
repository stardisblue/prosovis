import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnyEvent } from '../data';

type IntervalMask = {
  start: string;
  end: string;
};

type KindMask = {
  [k in AnyEvent['kind']]: boolean;
};

type BoundsMask = [{ lat: number; lng: number }, { lat: number; lng: number }];

export const maskSlice = createSlice({
  name: 'filters',
  initialState: {} as {
    interval?: IntervalMask;
    kind?: KindMask;
    bounds?: BoundsMask;
  },
  reducers: {
    setIntervalMask: function(state, { payload }: PayloadAction<IntervalMask>) {
      state.interval = payload;
    },
    toggleKindMask: function(
      state,
      { payload }: PayloadAction<AnyEvent['kind']>
    ) {
      if (state.kind) state.kind[payload] = !state.kind[payload];
    },
    setKindMask: function(state, { payload }: PayloadAction<KindMask>) {
      state.kind = payload;
    },
    setBoundsMask: function(state, { payload }: PayloadAction<BoundsMask>) {
      state.bounds = payload;
    },
    clearMask: function() {
      return {};
    }
  }
});

export const {
  setIntervalMask,
  setKindMask,
  toggleKindMask,
  setBoundsMask,
  clearMask
} = maskSlice.actions;

export default maskSlice.reducer;
