import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import Axios from 'axios';
import { ProsoVisRelations } from '../types/relations';

const initialState: {
  relations: ProsoVisRelations | null;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  url: string;
} = {
  relations: null,
  loading: 'idle',
  url: './data/relations.json',
};

export const fetchRelations = createAsyncThunk(
  'relations/fetch',
  async (_, { signal }) => {
    const source = Axios.CancelToken.source();
    signal.addEventListener('abort', () => {
      source.cancel();
    });
    const response = await Axios.get('./data/relations.json', {
      cancelToken: source.token,
    });
    return response.data as ProsoVisRelations;
  }
);

const actorDataSlice = createSlice({
  name: 'relations',
  initialState,
  reducers: {
    setUrl(state, { payload }: PayloadAction<string>) {
      state.url = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRelations.pending, (state) => ({
      ...state,
      loading: 'pending',
    }));
    builder.addCase(fetchRelations.fulfilled, (state, action) => ({
      ...state,
      loading: 'idle',
      relations: action.payload,
    }));
    builder.addCase(fetchRelations.rejected, (state) => ({
      ...state,
      loading: 'failed',
    }));
  },
});

export default actorDataSlice.reducer;
