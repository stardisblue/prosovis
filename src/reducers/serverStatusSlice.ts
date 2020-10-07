import { createSlice } from '@reduxjs/toolkit';
export const serverStatusSlice = createSlice({
  name: 'server-status',
  initialState: true,
  reducers: {
    setOnline(state) {
      return true;
    },
    setOffline(state) {
      return false;
    },
  },
});

export const { setOnline, setOffline } = serverStatusSlice.actions;

export default serverStatusSlice.reducer;
