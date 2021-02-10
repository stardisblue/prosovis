import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InteractionPayload } from '../../types/interaction';

export const globalSelectionSlice = createSlice({
  name: 'global/selection',
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

export default globalSelectionSlice.reducer;

export const {
  reset: resetGlobalSelection,
  set: setGlobalSelection,
} = globalSelectionSlice.actions;
