import { RootState } from '../reducers';
import { createSelector } from '@reduxjs/toolkit';
import _ from 'lodash';

export const selectHighlights = (state: RootState) => state.highlights;

export const highlightsAsMap = createSelector([selectHighlights], res =>
  _.keyBy(res, i => i.id)
);
