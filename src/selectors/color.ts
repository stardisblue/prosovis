import { RootState } from '../reducers';
import { createSelector } from '@reduxjs/toolkit';
import { PrimaryKey } from '../data/models';
import * as d3 from 'd3';
import { selectActors } from './event';
import _ from 'lodash';
import { SiprojurisEvent } from '../data/sip-models';

export const selectColor = (state: RootState) => state.color;
export const selectDomain = createSelector(selectColor, (c) => c.kindDomain);
export const selectKindRange = createSelector(selectColor, (c) => c.kindRange);
export const selectActorRange = createSelector(
  selectColor,
  (c) => c.actorRange
);

export const selectMainColor = createSelector(
  selectDomain,
  selectKindRange,
  (domain, range) =>
    d3
      .scaleOrdinal<SiprojurisEvent['kind'] | string, string>()
      .domain(domain)
      .range(range)
);

const actorColor = d3.scaleOrdinal<PrimaryKey, string>();
export const selectActorColor = createSelector(
  selectActorRange,
  selectActors,
  (range, actors) => {
    let oldDomain = actorColor.domain();
    if (oldDomain.length === 0) {
      oldDomain = _.map(actors, 'id');
    }

    let oldRange = actorColor.range();
    if (oldRange.length === 0) oldRange = range;

    const trimmedRange = _.slice(oldRange, 0, oldDomain.length);
    const left = _.slice(oldRange, oldDomain.length);

    const zipped = _.zip(oldDomain, trimmedRange) as [PrimaryKey, string][];
    // what's in zipped and actor
    const keep = _.filter(
      zipped,
      ([id]) => _.find(actors, (a) => a.id === id) !== undefined
    );
    // what's in zipped but not actor
    const discard = _.filter(
      zipped,
      ([id]) => _.find(actors, (a) => a.id === id) === undefined
    );
    // what's in actor but not in zipped
    const add = _.filter(
      actors,
      (a) => _.find(zipped, ([id]) => a.id === id) === undefined
    );
    if (discard.length >= add.length) {
      const [, rainbow] = _(discard).unzip().value() as [
        PrimaryKey[],
        string[]
      ];
      keep.push(
        ...(_.zip(_.map(add, 'id'), _.slice(rainbow, 0, add.length)) as [
          PrimaryKey,
          string
        ][])
      );

      const [newDomain, newRange] = _.unzip(keep) as [PrimaryKey[], string[]];

      if (!newDomain && !newRange) {
        return actorColor.range([]).domain([]).copy();
      }

      actorColor
        .range(_.concat(newRange, _.slice(rainbow, add.length), left))
        .domain(newDomain);
      return actorColor.copy();
    } else {
      const [newDomain, newRange] = _.unzip(keep) as [PrimaryKey[], string[]];
      actorColor
        .range(_.concat(newRange, left))
        .domain(_.concat(newDomain, _.map(add, 'id')));
      return actorColor.copy();
    }
  }
);

export const selectBorderColor = createSelector(
  selectDomain,
  selectKindRange,
  (domain, range) =>
    d3
      .scaleOrdinal<SiprojurisEvent['kind'] | string, string>()
      .domain(domain)
      .range(range.map((d) => d3.color(d)!.darker(2).toString()))
);
