import { some } from 'lodash/fp';
import { createSelector } from 'reselect';
import { RootState } from '../../../reducers';

export const selectCustomFilters = (state: RootState) => state.customFilter;

export const selectUsedCustomFilters = createSelector(
  selectCustomFilters,
  some((filter) => some((v) => v === null, filter))
);
