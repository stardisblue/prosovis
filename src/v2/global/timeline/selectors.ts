import { createSelector } from 'reselect';
import {
  concat,
  flatMap,
  get,
  groupBy,
  map,
  pipe,
  filter,
  first,
} from 'lodash/fp';
import { utcDay, utcYear, utcYears } from 'd3';
import { RichEvent } from '../../models/EventModel';
import { selectAllMaskedEvents } from '../../selectors/globalKindMask';

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

export const selectDiscrete = createSelector(selectAllMaskedEvents, function (
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
