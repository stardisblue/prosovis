import _ from 'lodash';
import { AntPathEvent } from './AntPath';
import { Datation } from '../../../data/typings';
import * as d3 from 'd3-array';
type FlatAntPath = {
  event: AntPathEvent;
  start: string;
  end: string;
}[];

export default function pathMaker(this: any) {
  let stack: AntPathEvent[] = [];
  let results: FlatAntPath = [];

  function add(event: AntPathEvent) {
    const eventFirst = getFirstDate(event);

    solve(eventFirst);

    const last = _.last(stack);
    if (last) {
      // case 2 or 3
      results.push({
        event: last,
        start: getFirstDate(last),
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

        stack = _.compact(stack);
      }
    }
    // console.log('solve', _.map(results));
  }

  function clean(threshold: string) {
    stack = _.filter(stack, (s) => threshold < getLastDate(s));
    // console.log('clean', _.map(stack));
  }

  return { solve, add, results: () => results };
}

export class PathMaker {
  stack: AntPathEvent[] = [];
  results: FlatAntPath = [];

  add = (event: AntPathEvent) => {
    const eventFirst = getFirstDate(event);

    this.solve(eventFirst);

    const last = _.last(this.stack);
    if (last) {
      // case 2 or 3
      this.results.push({
        event: last,
        start: getFirstDate(last),
        end: eventFirst,
      });
    }

    this.clean(getLastDate(event));
    this.stack.push(event);
    // console.log('add', _.map(this.stack), _.map(this.results));
  };

  solve = (threshold?: string) => {
    if (this.stack.length > 0) {
      let previous = this.stack[this.stack.length - 1];
      let prevLast = getLastDate(previous);

      if (threshold === undefined || prevLast <= threshold) {
        let start = getFirstDate(previous);
        this.stack[this.stack.length - 1] = null!; // destroying from stack

        for (let i = this.stack.length - 2; i >= 0; i--) {
          if (threshold !== undefined && threshold < prevLast) break; //ignore next possibles

          this.results.push({ event: previous, start, end: prevLast });
          start = prevLast;
          previous = this.stack[i];
          prevLast = getLastDate(previous);
          this.stack[i] = null!;
        }

        if (threshold === undefined || prevLast <= threshold) {
          this.results.push({ event: previous, start, end: prevLast });
        }

        this.stack = _.compact(this.stack);
      }
    }
    // console.log('solve', _.map(this.results));
  };

  private clean = (threshold: string) => {
    this.stack = _.filter(this.stack, (s) => threshold < getLastDate(s));
    // console.log('clean', _.map(this.stack));
  };
}

export function flatify(events: AntPathEvent[]) {
  // console.groupCollapsed('pathmaker');
  const { solve, add, results } = pathMaker();

  _(events).sortBy(getFirstDate).forEach(add);

  solve();

  // console.groupEnd();
  return results();
}

type SimpleAntPath = {
  interval: [AntPathEvent, AntPathEvent];
  id: string;
  start: string;
  end: string;
}[];

export function simplify(flatPath: FlatAntPath) {
  return _.transform(
    flatPath,
    (acc, { event, start, end }) => {
      const prev = _.last(acc);
      if (prev !== undefined && prev.id === event.groupId) {
        prev.interval[1] = event;
        prev.end = end;
      } else {
        acc.push({ interval: [event, event], id: event.groupId, start, end });
      }
    },
    [] as SimpleAntPath
  );
}

type PathSegment = {
  segment: [AntPathEvent, AntPathEvent];
  diff: number;
  // dist: number;
};

export function segmentify(
  // this: L.Map,
  simplePath: SimpleAntPath
): PathSegment[] {
  return d3.pairs(
    simplePath,
    ({ interval: [, first], end }, { interval: [last], start }) => {
      const segment: [AntPathEvent, AntPathEvent] = [first, last];

      // const [p1, p2] = _.map(segment, (v) => this.latLngToLayerPoint(v.latLng));

      return {
        segment,
        diff: +start.slice(0, 4) - +end.slice(0, 4),
        // dist: p1.distanceTo(p2),
      };
    }
  );
}

export const getFirstDate = ({ event }: AntPathEvent) =>
  _.first<Datation>(event.dates)!.clean_date;
export const getLastDate = ({ event }: AntPathEvent) =>
  _.last<Datation>(event.dates)!.clean_date;
