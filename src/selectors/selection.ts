import { RootState } from '../reducers';
import { createSelector } from '@reduxjs/toolkit';
import _ from 'lodash';

export const selectSelection = (state: RootState) => state.selection;

export const selectionAsMap = createSelector([selectSelection], res =>
  _.keyBy(res, 'id')
);
