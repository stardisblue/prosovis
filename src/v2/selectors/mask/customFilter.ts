import * as d3 from 'd3';
import { keys, some as kvsome } from 'lodash';
import { get, pickBy, some } from 'lodash/fp';
import { createSelector } from 'reselect';
import { RootState } from '../../../reducers';
import { resolveCustomFilterTypes } from '../../reducers/mask/customFilterSlice';
import { ProsoVisDetailRichEvent, RichEvent } from '../../types/events';

const selectCustoms = (state: RootState) => state.customFilter;
export const selectCustomFilters = createSelector(
  selectCustoms,
  (customFilters) => customFilters.filters
);

export const selectDefaultFilterPath = createSelector(
  selectCustoms,
  (customFilters) => customFilters.selected
);

export const selectDefaultFilterResolver = createSelector(
  selectDefaultFilterPath,
  (path) => (e: RichEvent) =>
    resolveCustomFilterTypes(get(path ?? 'event.kind', e))
);

export const selectDefaultCustomFilter = createSelector(
  selectCustoms,
  ({ filters, selected }) => (selected !== null ? filters[selected] : null)
);

export const selectCustomFilterDefaultValues = createSelector(
  selectDefaultCustomFilter,
  (filter) => keys(filter?.values)
);

export const selectRestCustomFilters = createSelector(
  selectCustoms,
  ({ filters, selected }) => pickBy((_v, key) => key !== selected, filters)
);

export const selectUsedCustomFilters = createSelector(
  selectRestCustomFilters,
  some((filter) => some(({ value }) => value === null, filter.values))
);

export const selectCustomFiltersFun = createSelector(
  selectCustomFilters,
  (filters) => (e: ProsoVisDetailRichEvent) =>
    !kvsome(filters, (filter, path) => {
      return (
        filter.values[resolveCustomFilterTypes(get(path, e))].value === null
      );
    })
);

export const selectCustomFilterColor = createSelector(
  selectCustomFilterDefaultValues,
  (domain) =>
    d3.scaleOrdinal<string, string>().domain(domain).range(d3.schemeTableau10)
);
