import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProsoVisLocalisation } from '../types/localisations';
import Axios from 'axios';

const initialState: {
  localisations?: _.Dictionary<ProsoVisLocalisation>;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  url: string;
} = {
  loading: 'idle',
  url: './data/index-localisations.json',
};

export const fetchLocalisations = createAsyncThunk(
  'localisations/fetch',
  async (_, { signal }) => {
    const source = Axios.CancelToken.source();
    signal.addEventListener('abort', () => {
      source.cancel();
    });
    const response = await Axios.get('./data/index-localisations.json', {
      cancelToken: source.token,
    });
    return response.data as _.Dictionary<ProsoVisLocalisation>;
  }
);

const actorDataSlice = createSlice({
  name: 'localisations',
  initialState,
  reducers: {
    setUrl(state, { payload }: PayloadAction<string>) {
      state.url = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLocalisations.pending, (state) => ({
      ...state,
      loading: 'pending',
    }));
    builder.addCase(fetchLocalisations.fulfilled, (state, action) => ({
      ...state,
      loading: 'idle',
      localisations: action.payload,
    }));
    builder.addCase(fetchLocalisations.rejected, (state) => ({
      ...state,
      loading: 'failed',
    }));
  },
});

export default actorDataSlice.reducer;
