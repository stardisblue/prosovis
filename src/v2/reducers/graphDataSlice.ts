import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import Axios from 'axios';
import { ProsoVisGraph } from '../types/graph';

const initialState: {
  graph: ProsoVisGraph | null;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  url: string;
} = {
  graph: null,
  loading: 'idle',
  url: './data/graph.json',
};

export const fetchGraph = createAsyncThunk(
  'graph/fetch',
  async (_, { signal }) => {
    const source = Axios.CancelToken.source();
    signal.addEventListener('abort', () => {
      source.cancel();
    });
    const response = await Axios.get('./data/graph.json', {
      cancelToken: source.token,
    });
    return response.data as ProsoVisGraph;
  }
);

const actorDataSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    setUrl(state, { payload }: PayloadAction<string>) {
      state.url = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGraph.pending, (state) => ({
      ...state,
      loading: 'pending',
    }));
    builder.addCase(fetchGraph.fulfilled, (state, action) => ({
      ...state,
      loading: 'idle',
      graph: action.payload,
    }));
    builder.addCase(fetchGraph.rejected, (state) => ({
      ...state,
      loading: 'failed',
    }));
  },
});

export default actorDataSlice.reducer;
