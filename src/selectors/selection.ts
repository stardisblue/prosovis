import { RootState } from '../reducers';
import { createSelector } from '@reduxjs/toolkit';
import { keyBy } from 'lodash/fp';

export const selectSelection = (state: RootState) => state.selection;

export const selectionAsMap = createSelector(selectSelection, (sel) =>
  keyBy('id', sel)
);
