import { RootState } from '../reducers';
import { createSelector } from '@reduxjs/toolkit';
import { AnyEvent } from '../data';
import * as d3 from 'd3';

export const selectColor = (state: RootState) => state.color;
export const selectDomain = createSelector(selectColor, c => c.domain);
export const selectRange = createSelector(selectColor, c => c.range);

export const selectMainColor = createSelector(
  selectDomain,
  selectRange,
  (domain, range) =>
    d3
      .scaleOrdinal<AnyEvent['kind'] | string, string>()
      .domain(domain)
      .range(range)
);

export const selectBorderColor = createSelector(
  selectDomain,
  selectRange,
  (domain, range) =>
    d3
      .scaleOrdinal<AnyEvent['kind'] | string, string>()
      .domain(domain)
      .range(
        range.map(d =>
          d3
            .color(d)!
            .darker(2)
            .toString()
        )
      )
);
