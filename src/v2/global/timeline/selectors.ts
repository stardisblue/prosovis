import { createSelector } from 'reselect';
import { selectAllEvents, selectAllKinds } from '../../selectors/events';
import {
  concat,
  countBy,
  flatMap,
  get,
  groupBy,
  map,
  pipe,
  sortBy,
  filter,
  values,
  first,
} from 'lodash/fp';
import {
  stack,
  stackOffsetSilhouette,
  stackOrderInsideOut,
  utcDay,
  utcYear,
  utcYears,
} from 'd3';
import { RichEvent } from '../../models/EventModel';
import { selectMainColor } from '../../../selectors/color';
import type { Dictionary } from 'lodash';

export type Tyvent<T> = {
  value: T;
  time: Date;
};

const discretize: (e: RichEvent) => Tyvent<string>[] = ({ value: e }) => {
  if (e.datation.length === 2) {
    const [start, end] = map(
      pipe(get('value'), (d) => new Date(d), utcYear.floor),
      e.datation
    );
    return utcYears(start, utcDay.offset(end, 1)).map((time) => ({
      value: e.kind,
      time,
    }));
  } else if (e.datation.length === 1) {
    return [
      {
        value: e.kind,
        time: pipe((d) => new Date(d), utcYear)(e.datation[0].value),
      },
    ];
  }
  return [];
};

export const selectDiscrete = createSelector(selectAllEvents, function (
  events
) {
  return pipe(
    flatMap(discretize),
    concat(
      utcYear
        .range(new Date(1700, 0, 1), new Date(2000, 0, 1))
        .map<Tyvent<''>>((d) => ({ time: d, value: '' }))
    ),
    groupBy(pipe(get('time'), (v) => +v!)),
    map<Tyvent<string>[], Tyvent<Tyvent<string>[]>>((v) => ({
      time: pipe(first, get('time'))(v),
      value: filter('value', v),
    }))
  )(events) as Tyvent<Tyvent<string>[]>[];
});

export const selectStack = createSelector(
  selectDiscrete,
  selectMainColor,
  selectAllKinds,
  function (events, colors, kinds) {
    const flatten = pipe(
      map<Tyvent<Tyvent<string>[]>, Tyvent<Dictionary<number>>>(
        ({ time, value }) => ({
          time,
          value: countBy('value', value),
        })
      ),
      sortBy<Tyvent<Dictionary<number>>>('time')
    )(events);

    return {
      stack: stack<any, Tyvent<Dictionary<number>>, string>()
        .keys(values(kinds))
        .offset(stackOffsetSilhouette)
        .order(stackOrderInsideOut)
        .value((d, k) => d.value[k] || 0)(flatten),
      color: colors,
    };
  }
);
