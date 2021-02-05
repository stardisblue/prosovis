import { createSlice, PayloadAction } from '@reduxjs/toolkit';
type MapBoundsMask = [
  { lat: number; lng: number },
  { lat: number; lng: number }
];

const maskGlobalMapBoundsSlice = createSlice({
  name: 'mask-global-map-bounds',
  initialState: null as MapBoundsMask | null,
  reducers: {
    set(_state, { payload }: PayloadAction<MapBoundsMask>) {
      return payload;
    },
    clear() {
      return null;
    },
  },
});

export default maskGlobalMapBoundsSlice.reducer;
export const {
  set: setMaskGlobalMapBounds,
  clear: clearMaskGlobalMapBounds,
} = maskGlobalMapBoundsSlice.actions;
