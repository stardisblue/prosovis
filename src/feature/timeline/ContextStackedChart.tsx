import { createSelector } from '@reduxjs/toolkit';
import * as d3 from 'd3';
import { parseISO } from 'date-fns';
import { map as _map } from 'lodash';
import {
  concat,
  countBy,
  flatMap,
  get,
  groupBy,
  map,
  mapValues,
  pipe,
  sortBy,
} from 'lodash/fp';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectActorColor, selectKindColor } from '../../selectors/color';
import { selectSwitch } from '../../selectors/switch';
import {
  selectDetailActorIds,
  selectDetailsRichEvents,
} from '../../v2/selectors/detail/actors';
import {
  selectCustomFilterDefaultValues,
  selectDefaultFilterResolver,
} from '../../v2/selectors/mask/customFilter';
import { ProsoVisDetailRichEvent } from '../../v2/types/events';
import ContextOptions from './ContextOptions';

export type StackEvent = { kind: string; actor: string | null; time: Date };

const defaultInterval = d3.utcYear
  // TODO extract this date
  .range(new Date(1700, 0, 1), new Date(2000, 0, 1))
  .map((d) => ({ time: d, kind: '', actor: null }));

export const selectDiscrete = createSelector(
  selectDetailsRichEvents,
  selectDefaultFilterResolver,
  (events, path) =>
    pipe(
      flatMap((event: ProsoVisDetailRichEvent) => {
        if (event.event.datation.length === 2) {
          const [start, end] = map(
            pipe(get('value'), (d) => new Date(d), d3.utcYear.floor),
            event.event.datation
          );

          return d3.utcYears(start, d3.utcDay.offset(end, 1)).map((time) => ({
            kind: path(event),
            actor: event.actor,
            time,
          }));
        } else if (event.event.datation.length === 1) {
          return [
            {
              kind: path(event),
              actor: event.actor,
              time: d3.utcYear(parseISO(event.event.datation[0].value)),
            },
          ];
        }
        return [];
      }),
      concat(defaultInterval),
      groupBy<StackEvent>('time')
    )(events) as _.Dictionary<StackEvent[]>
);

const selectMap = createSelector(
  selectSwitch,
  selectDetailActorIds,
  selectCustomFilterDefaultValues,
  selectKindColor,
  selectActorColor,
  (switcher, actors, kinds, mainColor, actorColor) =>
    switcher === 'Actor'
      ? { countBy: 'actor', keys: actors, color: actorColor }
      : // TODO groupby
        { countBy: 'kind', keys: kinds, color: mainColor }
);

const selectStack = createSelector(
  selectDiscrete,
  selectMap,
  function (events, selection) {
    const flatten = pipe(
      mapValues(countBy<StackEvent[]>(selection.countBy)),
      (v) => _map(v, (value, time) => ({ time: new Date(time), ...value })),
      sortBy<
        _.Dictionary<number> &
          {
            time: Date;
          }[]
      >('time')
    )(events);

    return {
      stack: d3
        .stack()
        .keys(selection.keys)
        .order(d3.stackOrderInsideOut)
        .value((d, k) => d[k] || 0)(flatten as any),
      color: selection.color,
    };
  }
);

type D3Selection = d3.Selection<
  SVGGElement,
  d3.Series<_.Dictionary<number>, string>[],
  any,
  undefined
>;

export const ContextStackedChart: React.FC<{
  x: d3.ScaleTime<number, number>;
}> = function ({ x }) {
  // ! assuming that ref is instantaneously populated
  const chart = useRef<D3Selection>(null as any);
  const chartRef = useCallback(function (dom: SVGGElement) {
    if (!dom) return;
    chart.current = d3.select(dom);
  }, []);

  const stackAndColor = useSelector(selectStack);

  const y = useMemo(
    function () {
      return (
        d3
          .scalePow()
          .domain([
            d3.min(stackAndColor.stack, (d) => d3.min(d, (d) => d[0])) as any,
            d3.max(stackAndColor.stack, (d) => d3.max(d, (d) => d[1])) as any,
          ])
          // .nice()
          .range([
            ContextOptions.height - ContextOptions.margin.bottom,
            ContextOptions.margin.top,
          ])
      );
    },
    [stackAndColor.stack]
  );

  const area = useMemo(
    function () {
      return d3
        .area()
        .x((d: any) => x(d.data.time))
        .y0((d) => y(d[0]))
        .y1((d) => y(d[1]))
        .curve(d3.curveStep);
    },
    [x, y]
  );

  useEffect(
    function () {
      chart.current
        .selectAll('path')
        .data(stackAndColor.stack)
        .join('path')
        .attr('fill', (d: any) => stackAndColor.color(d.key))
        .attr('d', area as any)
        .append('title')
        .text((d) => d.key);
    },
    [area, stackAndColor]
  );

  return <g id="context-stackedchart" ref={chartRef}></g>;
};

export default ContextStackedChart;
