import { RootState } from '../reducers';
import { createSelector } from '@reduxjs/toolkit';
import { keyBy } from 'lodash/fp';

export const selectHighlights = (state: RootState) => state.highlights;

export const highlightsAsMap = createSelector(selectHighlights, (res) =>
  keyBy('id', res)
);
