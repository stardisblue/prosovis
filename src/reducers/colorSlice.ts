import { createSlice } from '@reduxjs/toolkit';

export const colorSlice = createSlice({
  name: 'color',
  initialState: {
    domain: [
      'PassageExamen',
      'Birth',
      'Education',
      'Retirement',
      'SuspensionActivity',
      'Death',
      'ObtainQualification'
    ],
    range: [
      '#a6cee3',
      '#1f78b4',
      '#b2df8a',
      '#33a02c',
      '#fb9a99',
      '#e31a1c',
      '#fdbf6f'
    ]
  },
  reducers: {}
});

export default colorSlice.reducer;
