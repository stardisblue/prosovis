import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProsoVisActors } from '../types/actors';
import Axios from 'axios';

const initialState: {
  actors: ProsoVisActors | null;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  url: string;
} = { actors: null, loading: 'idle', url: './data/index-actors.json' };

export const fetchActors = createAsyncThunk(
  'actors/fetch',
  async (_, { signal }) => {
    const source = Axios.CancelToken.source();
    signal.addEventListener('abort', () => {
      source.cancel();
    });
    const response = await Axios.get('./data/index-actors.json', {
      cancelToken: source.token,
    });
    return response.data as ProsoVisActors;
  }
);

const actorDataSlice = createSlice({
  name: 'actors',
  initialState,
  reducers: {
    setUrl(state, { payload }: PayloadAction<string>) {
      state.url = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchActors.pending, (state) => ({
      ...state,
      loading: 'pending',
    }));
    builder.addCase(fetchActors.fulfilled, (state, action) => ({
      ...state,
      loading: 'pending',
      actors: action.payload,
    }));
    builder.addCase(fetchActors.rejected, (state) => ({
      ...state,
      loading: 'failed',
    }));
  },
});

export default actorDataSlice.reducer;
