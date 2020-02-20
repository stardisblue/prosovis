import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import * as d3 from 'd3';
import { selectMainColor } from '../../selectors/color';
import moment from 'moment';
import { selectEvents, selectKinds } from '../../selectors/event';
import _ from 'lodash';
import { createSelector } from '@reduxjs/toolkit';
import { AnyEvent } from '../../data';
import ContextOptions from './ContextOptions';

export const selectStack = createSelector(selectEvents, selectKinds, function(
  events,
  kinds
) {
  const flatten = _(events)
    .flatMap<{ kind: AnyEvent['kind'] | ''; time: Date } | undefined>(e => {
      if (e.datation.length === 2) {
        const [start, end] = _(e.datation)
          .map(d => d3.timeYear.floor(new Date(d.clean_date)))
          .sort()
          .value();

        return d3.timeYears(start, d3.timeDay.offset(end, 1)).map(time => ({
          kind: e.kind,
          time
        }));
      } else if (e.datation.length === 1) {
        return {
          kind: e.kind,
          time: d3.timeYear(moment(e.datation[0].clean_date).toDate())
        };
      }
    })
    .concat(
      d3.timeYear
        .range(new Date(1700, 0, 1), new Date(2000, 0, 1))
        .map(d => ({ time: d, kind: '' }))
    )
    .groupBy('time')
    .mapValues(v => _.countBy(v, 'kind'))
    .map((value, time) => ({ time: new Date(time), ...value }))
    .sortBy('time')
    .value();

  return d3
    .stack()
    .keys(kinds)
    .order(d3.stackOrderInsideOut)
    .value((d, k) => d[k] || 0)(flatten as any);
});

type D3Selection = d3.Selection<
  SVGGElement,
  d3.Series<
    {
      [key: string]: number;
    },
    string
  >[],
  any,
  undefined
>;

export const ContextStackedChart: React.FC<{
  x: d3.ScaleTime<number, number>;
}> = function({ x }) {
  // ! assuming that ref is instantaneously populated
  const chart = useRef<D3Selection>({} as any);

  const color = useSelector(selectMainColor);

  const chartRef = useCallback(function(dom: SVGGElement) {
    if (!dom) return;
    chart.current = d3.select(dom);
  }, []);

  const countStack = useSelector(selectStack);

  const y = useMemo(
    function() {
      return (
        d3
          .scalePow()
          .domain([
            d3.min(countStack, d => d3.min(d, d => d[0])) as any,
            d3.max(countStack, d => d3.max(d, d => d[1])) as any
          ])
          // .nice()
          .range([
            ContextOptions.height - ContextOptions.margin.bottom,
            ContextOptions.margin.top
          ])
      );
    },
    [countStack]
  );

  const area = useMemo(
    function() {
      return d3
        .area()
        .x((d: any) => x(d.data.time))
        .y0(d => y(d[0]))
        .y1(d => y(d[1]))
        .curve(d3.curveStep);
    },
    [x, y]
  );

  useEffect(
    function() {
      chart.current
        .selectAll('path')
        .data(countStack)
        .join('path')
        .attr('fill', (d: any) => color(d.key))
        .attr('d', area as any)
        .append('title')
        .text(d => d.key);
    },
    [area, color, countStack]
  );

  return <g id="context-stackedchart" ref={chartRef}></g>;
};

export default ContextStackedChart;
