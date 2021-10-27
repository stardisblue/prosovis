import { utcDay, utcYear, utcYears } from 'd3';
import { parseISO } from 'date-fns';
import {
  concat,
  countBy,
  first,
  flatMap,
  groupBy,
  isNil,
  map,
  pipe,
  sortBy,
} from 'lodash/fp';
import { createSelector } from 'reselect';
import {
  selectEventsWithoutKinds,
  selectRichEventsTimed,
} from '../../selectors/mask';
import { selectDefaultFilterResolver } from '../../selectors/mask/customFilter';
import { ProsoVisDate, RichEvent } from '../../types/events';

export type Tyvent<T> = {
  value: T;
  time: Date;
};

const defaultInterval = utcYear
  // TODO date :)
  .range(new Date(1700, 0, 1), new Date(2000, 0, 1))
  .map<Tyvent<''>>((d) => ({ time: d, value: '' }));

export const discretize: (
  path: (e: RichEvent) => string
) => (e: RichEvent) => Tyvent<string>[] = (path) => (event) => {
  if (isNil(event.event.datation)) return [];

  if (event.event.datation.length === 2) {
    const [start, end] = map(
      pipe((d: ProsoVisDate) => d.value, parseISO, utcYear.floor),
      event.event.datation
    );
    return utcYears(start, utcDay.offset(end, 1)).map((time) => ({
      value: path(event),
      time,
    }));
  } else if (event.event.datation?.length === 1) {
    return [
      {
        value: path(event),
        time: pipe(parseISO, utcYear)(event.event.datation[0].value),
      },
    ];
  }
  return [];
};

export const selectBackgroundDiscrete = createSelector(
  selectEventsWithoutKinds,
  selectDefaultFilterResolver,
  fillEmpty
);

export const selectDiscrete = createSelector(
  selectRichEventsTimed,
  selectDefaultFilterResolver,
  fillEmpty
);

export function fillEmpty(
  events: RichEvent[] | undefined,
  path: (e: RichEvent) => string
): Tyvent<Tyvent<string>[]>[] | undefined {
  if (isNil(events)) return;
  return pipe(
    flatMap(discretize(path)),
    concat(defaultInterval),
    groupBy(pipe((d) => +d.time)),
    map<Tyvent<string>[], Tyvent<Tyvent<string>[]>>((v) => ({
      time: first(v)?.time!,
      value: v.filter((v) => v.value, v),
    }))
  )(events) as Tyvent<Tyvent<string>[]>[];
}

export const flatten = pipe(
  map<Tyvent<Tyvent<string>[]>, Tyvent<_.Dictionary<number>>>(
    ({ time, value }) => ({
      time,
      value: countBy((d) => d.value, value),
    })
  ),
  sortBy<Tyvent<_.Dictionary<number>>>((d) => d.time)
);
