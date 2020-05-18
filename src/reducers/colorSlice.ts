import { createSlice } from '@reduxjs/toolkit';
export const colorSlice = createSlice({
  name: 'color',
  initialState: {
    kindDomain: [
      'PassageExamen',
      'Birth',
      'Education',
      'Retirement',
      'SuspensionActivity',
      'Death',
      'ObtainQualification',
    ],
    kindRange: [
      '#a6cee3',
      '#1f78b4',
      '#b2df8a',
      '#33a02c',
      '#fb9a99',
      '#e31a1c',
      '#fdbf6f',
    ],
    actorRange: [
      '#66c2a5',
      '#fc8d62',
      '#8da0cb',
      '#e78ac3',
      '#e5c494',
      '#a6d854',
      '#ffd92f',
      '#b3b3b3',
    ], //
  },
  reducers: {},
});

export default colorSlice.reducer;
