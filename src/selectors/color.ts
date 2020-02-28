import { RootState } from '../reducers';
import { createSelector } from '@reduxjs/toolkit';
import { AnyEvent, PrimaryKey } from '../data';
import * as d3 from 'd3';
import { selectActors } from './event';

export const selectColor = (state: RootState) => state.color;
export const selectDomain = createSelector(selectColor, c => c.kindDomain);
export const selectKindRange = createSelector(selectColor, c => c.kindRange);
export const selectActorRange = createSelector(selectColor, c => c.actorRange);

export const selectMainColor = createSelector(
  selectDomain,
  selectKindRange,
  (domain, range) =>
    d3
      .scaleOrdinal<AnyEvent['kind'] | string, string>()
      .domain(domain)
      .range(range)
);

export const selectActorColor = createSelector(
  selectActorRange,
  selectActors,
  (range, actors) =>
    d3.scaleOrdinal<PrimaryKey, string>(range).domain(actors.map(a => a.id))
);

export const selectBorderColor = createSelector(
  selectDomain,
  selectKindRange,
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
