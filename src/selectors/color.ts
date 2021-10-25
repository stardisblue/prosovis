import { RootState } from '../reducers';
import { createSelector } from '@reduxjs/toolkit';
import * as d3 from 'd3';
import { selectDetailActors } from '../v2/selectors/detail/actors';
import { map, slice, zip, filter, find, unzip, concat } from 'lodash';

export const selectColor = (state: RootState) => state.color;
export const selectDomain = createSelector(selectColor, (c) => c.kindDomain);
export const selectKindRange = createSelector(selectColor, (c) => c.kindRange);
export const selectActorRange = createSelector(
  selectColor,
  (c) => c.actorRange
);

export const selectKindColor = createSelector(
  selectDomain,
  selectKindRange,
  (domain, range) =>
    d3.scaleOrdinal<string, string>().domain(domain).range(range)
);

const actorColor = d3.scaleOrdinal<string, string>();
export const selectActorColor = createSelector(
  selectActorRange,
  selectDetailActors,
  (range, actors) => {
    let oldDomain = actorColor.domain();
    if (oldDomain.length === 0) {
      oldDomain = map(actors, 'id');
    }

    let oldRange = actorColor.range();
    if (oldRange.length === 0) oldRange = range;

    const trimmedRange = slice(oldRange, 0, oldDomain.length);
    const left = slice(oldRange, oldDomain.length);

    const zipped = zip(oldDomain, trimmedRange) as [string, string][];
    // what's in zipped and actor
    const keep = filter(
      zipped,
      ([id]) => find(actors, (a) => a.id === id) !== undefined
    );
    // what's in zipped but not actor
    const discard = filter(
      zipped,
      ([id]) => find(actors, (a) => a.id === id) === undefined
    );
    // what's in actor but not in zipped
    const add = filter(
      actors,
      (a) => find(zipped, ([id]) => a.id === id) === undefined
    );
    if (discard.length >= add.length) {
      const [, rainbow] = unzip(discard) as [string[], string[]];
      keep.push(
        ...(zip(map(add, 'id'), slice(rainbow, 0, add.length)) as [
          string,
          string
        ][])
      );

      const [newDomain, newRange] = unzip(keep) as [string[], string[]];

      if (!newDomain && !newRange) {
        return actorColor.range([]).domain([]).copy();
      }

      actorColor
        .range(concat(newRange, slice(rainbow, add.length), left))
        .domain(newDomain);
      return actorColor.copy();
    } else {
      const [newDomain, newRange] = unzip(keep) as [string[], string[]];
      actorColor
        .range(concat(newRange, left))
        .domain(concat(newDomain, map(add, 'id')));
      return actorColor.copy();
    }
  }
);
