import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SiprojurisEvent } from '../data/sip-models';

type IntervalMask = {
  start: string;
  end: string;
};

export type KindMask = {
  [k in SiprojurisEvent['kind']]?: boolean;
};

export type ActorMask = {
  [k in SiprojurisEvent['actor']['id']]?: boolean;
};

type BoundsMask = [{ lat: number; lng: number }, { lat: number; lng: number }];

export const maskSlice = createSlice({
  name: 'filters',
  initialState: {} as {
    interval?: IntervalMask;
    kind?: KindMask;
    bounds?: BoundsMask;
    actor?: ActorMask;
  },
  reducers: {
    setIntervalMask: function (
      state,
      { payload }: PayloadAction<IntervalMask>
    ) {
      state.interval = payload;
    },
    toggleKindMask: function (
      state,
      { payload }: PayloadAction<SiprojurisEvent['kind']>
    ) {
      if (state.kind)
        state.kind[payload] =
          state.kind[payload] !== undefined ? !state.kind[payload] : false;
      else state.kind = { [payload]: false };
    },
    setKindMask: function (state, { payload }: PayloadAction<KindMask>) {
      state.kind = payload;
    },
    toggleActorMask: function (
      state,
      { payload }: PayloadAction<SiprojurisEvent['actor']['id']>
    ) {
      if (state.actor)
        state.actor[payload] =
          state.actor[payload] !== undefined ? !state.actor[payload] : false;
      else state.actor = { [payload]: false };
    },
    setActorMask: function (state, { payload }: PayloadAction<ActorMask>) {
      state.actor = payload;
    },
    setBoundsMask: function (state, { payload }: PayloadAction<BoundsMask>) {
      state.bounds = payload;
    },
    clearMask: function () {
      return {};
    },
  },
});

export const {
  setIntervalMask,
  setKindMask,
  toggleKindMask,
  setActorMask,
  toggleActorMask,
  setBoundsMask,
  clearMask,
} = maskSlice.actions;

export default maskSlice.reducer;
