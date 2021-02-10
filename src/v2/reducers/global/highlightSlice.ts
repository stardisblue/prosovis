import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InteractionPayload } from '../../types/interaction';

export const globalHighlightSlice = createSlice({
  name: 'global/highlight',
  initialState: [] as InteractionPayload[],
  reducers: {
    reset() {
      return [];
    },
    set(
      state,
      { payload }: PayloadAction<InteractionPayload | InteractionPayload[]>
    ) {
      if (Array.isArray(payload)) return payload;
      return [payload];
    },
  },
});

export default globalHighlightSlice.reducer;

export const {
  reset: resetGlobalHighlight,
  set: setGlobalHighlight,
} = globalHighlightSlice.actions;
