import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const actorSummarySlice = createSlice({
  name: 'actor-summary',
  initialState: null as { x: number; y: number; actor: string } | null,
  reducers: {
    set(
      _state,
      { payload }: PayloadAction<{ x: number; y: number; actor: string }>
    ) {
      return payload;
    },
    reset() {
      return null;
    },
  },
});

export default actorSummarySlice.reducer;

export const {
  set: setActorSummary,
  reset: resetActorSummary,
} = actorSummarySlice.actions;
