import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProsoVisEvent } from '../types/events';
import Axios from 'axios';

export type EventDataStore = {
  events?: ProsoVisEvent[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  url: string;
};

const initialState: EventDataStore = {
  loading: 'idle',
  url: './data/index-events.json',
};

export const fetchEvents = createAsyncThunk(
  'events/fetch',
  async (_, { signal }) => {
    const source = Axios.CancelToken.source();
    signal.addEventListener('abort', () => {
      source.cancel();
    });
    const response = await Axios.get('./data/index-events.json', {
      cancelToken: source.token,
    });
    return response.data as ProsoVisEvent[];
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
    builder.addCase(fetchEvents.pending, (state) => ({
      ...state,
      loading: 'pending',
    }));
    builder.addCase(fetchEvents.fulfilled, (state, action) => ({
      ...state,
      loading: 'idle',
      events: action.payload,
    }));
    builder.addCase(fetchEvents.rejected, (state) => ({
      ...state,
      loading: 'failed',
    }));
  },
});

export default eventDataSlice.reducer;
