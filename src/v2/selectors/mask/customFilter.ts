import { some as kvsome } from 'lodash';
import { get, some } from 'lodash/fp';
import { createSelector } from 'reselect';
import { RootState } from '../../../reducers';
import { resolveCustomFilterTypes } from '../../reducers/mask/customFilterSlice';
import { ProsoVisDetailRichEvent } from '../../types/events';

export const selectCustomFilters = (state: RootState) => state.customFilter;

export const selectUsedCustomFilters = createSelector(
  selectCustomFilters,
  some((filter) => some((v) => v === null, filter))
);

export const selectCustomFiltersFun = createSelector(
  selectCustomFilters,
  (filters) => (e: ProsoVisDetailRichEvent) =>
    !kvsome(filters, (filter, path) => {
      return filter.values[resolveCustomFilterTypes(get(path, e))] === null;
    })
);
