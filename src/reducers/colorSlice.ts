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
    ],
    actorRange: [
      '#4e79a7',
      '#f28e2c',
      '#e15759',
      '#76b7b2',
      '#59a14f',
      '#edc949',
      '#af7aa1',
      '#ff9da7',
      '#9c755f',
      '#bab0ab'
    ]
  },
  reducers: {}
});

export default colorSlice.reducer;
