import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProsoVisEvents } from '../types/events';
import Axios from 'axios';

const initialState: {
  events: ProsoVisEvents | null;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  url: string;
} = { events: null, loading: 'idle', url: './v2/data/index-events.json' };

export const fetchEvents = createAsyncThunk(
  'events/fetch',
  async (_, { signal }) => {
    const source = Axios.CancelToken.source();
    signal.addEventListener('abort', () => {
      source.cancel();
    });
    const response = await Axios.get('./v2/data/index-events.json', {
      cancelToken: source.token,
    });
    return response.data as ProsoVisEvents;
  }
);

const eventDataSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setUrl(state, { payload }: PayloadAction<string>) {
      state.url = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchEvents.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(fetchEvents.fulfilled, (state, action) => {
      state.loading = 'idle';
      state.events = action.payload;
    });

    builder.addCase(fetchEvents.rejected, (state) => {
      state.loading = 'failed';
    });
  },
});

export default eventDataSlice.reducer;
