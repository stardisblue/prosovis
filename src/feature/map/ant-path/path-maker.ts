import { AntPathEvent } from './AntPath';
import * as d3 from 'd3-array';
import { DataMarkerOptions } from '../marker/Marker';
import {
  compact,
  first,
  forEach,
  last,
  pipe,
  sortBy,
  transform,
} from 'lodash/fp';
type FlatAntPath<T> = {
  event: AntPathEvent<T>;
  start: string;
  end: string;
}[];

export default function pathMaker(this: any) {
  let stack: AntPathEvent<DataMarkerOptions>[] = [];
  let results: FlatAntPath<DataMarkerOptions> = [];

  function add(event: AntPathEvent<DataMarkerOptions>) {
    const eventFirst = getFirstDate(event);
    if (!eventFirst) return; // makes sures that there is a date for this event, if not, the event is not added.

    solve(eventFirst);

    const lastEvent = last(stack);
    if (lastEvent) {
      // case 2 or 3
      results.push({
        event: lastEvent,
        start: getFirstDate(lastEvent),
        end: eventFirst,
      });
    }

    clean(getLastDate(event));
    stack.push(event);
    // console.log('add', _.map(this.stack), _.map(this.results));
  }

  function solve(threshold?: string) {
    if (stack.length > 0) {
      let previous = stack[stack.length - 1];
      let prevLast = getLastDate(previous);

      if (threshold === undefined || prevLast <= threshold) {
        let start = getFirstDate(previous);
        stack[stack.length - 1] = null!; // destroying from stack

        for (let i = stack.length - 2; i >= 0; i--) {
          if (threshold !== undefined && threshold < prevLast) break; //ignore next possibles

          results.push({ event: previous, start, end: prevLast });
          start = prevLast;
          previous = stack[i];
          prevLast = getLastDate(previous);
          stack[i] = null!;
        }

        if (threshold === undefined || prevLast <= threshold) {
          results.push({ event: previous, start, end: prevLast });
        }

        stack = compact(stack);
      }
    }
    // console.log('solve', _.map(results));
  }

  function clean(threshold: string) {
    stack = stack.filter((s) => threshold < getLastDate(s));
    // console.log('clean', _.map(stack));
  }

  return { solve, add, results: () => results };
}

export function flatify(events: AntPathEvent<DataMarkerOptions>[]) {
  // console.groupCollapsed('pathmaker');
  const { solve, add, results } = pathMaker();

  pipe(sortBy(getFirstDate), forEach(add))(events);

  solve();

  // console.groupEnd();
  return results();
}

type SimpleAntPath<T> = {
  interval: [AntPathEvent<T>, AntPathEvent<T>];
  id: string;
  start: string;
  end: string;
}[];

export function simplify(flatPath: FlatAntPath<DataMarkerOptions>) {
  return transform(
    (acc, { event, start, end }) => {
      const prev = last(acc);
      if (prev !== undefined && prev.id === event.groupId) {
        prev.interval[1] = event;
        prev.end = end;
      } else {
        acc.push({ interval: [event, event], id: event.groupId, start, end });
      }
    },
    [] as SimpleAntPath<DataMarkerOptions>,
    flatPath
  );
}

export type PathSegment<T> = {
  segment: [AntPathEvent<T>, AntPathEvent<T>];
  diff: number;
  // dist: number;
};

export function segmentify(
  simplePath: SimpleAntPath<DataMarkerOptions>
): PathSegment<DataMarkerOptions>[] {
  return d3.pairs(
    simplePath,
    ({ interval: [, first], end }, { interval: [last], start }) => {
      const segment: [
        AntPathEvent<DataMarkerOptions>,
        AntPathEvent<DataMarkerOptions>
      ] = [first, last];

      return { segment, diff: +start.slice(0, 4) - +end.slice(0, 4) };
    }
  );
}

export const getFirstDate = ({ event }: AntPathEvent<DataMarkerOptions>) =>
  first(event.dates)?.value!;
export const getLastDate = ({ event }: AntPathEvent<DataMarkerOptions>) =>
  last(event.dates)?.value!;
