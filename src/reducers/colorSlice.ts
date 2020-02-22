import { createSlice } from '@reduxjs/toolkit';
import * as d3 from 'd3-scale-chromatic';
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
      'ObtainQualification'
    ],
    kindRange: [
      '#a6cee3',
      '#1f78b4',
      '#b2df8a',
      '#33a02c',
      '#fb9a99',
      '#e31a1c',
      '#fdbf6f'
    ],
    actorRange: (d3 as any).schemeTableau10 as string[]
  },
  reducers: {}
});

export default colorSlice.reducer;
