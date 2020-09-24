import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import * as d3 from 'd3';
import { selectMainColor, selectActorColor } from '../../selectors/color';
import moment from 'moment';
import { selectEvents, selectKinds, selectActors } from '../../selectors/event';
import _ from 'lodash';
import { createSelector } from '@reduxjs/toolkit';
import { PrimaryKey } from '../../data/models';
import ContextOptions from './ContextOptions';
import { selectSwitch } from '../../selectors/switch';
import { SiprojurisEvent } from '../../data/sip-models';

export const selectDiscrete = createSelector(selectEvents, function (events) {
  return _(events)
    .flatMap<
      | {
          kind: SiprojurisEvent['kind'] | '';
          actor: PrimaryKey | null;
          time: Date;
        }
      | undefined
    >((e) => {
      if (e.datation.length === 2) {
        const [start, end] = _(e.datation)
          .map((d) => d3.timeYear.floor(new Date(d.clean_date)))
          .sort()
          .value();

        return d3.timeYears(start, d3.timeDay.offset(end, 1)).map((time) => ({
          kind: e.kind,
          actor: e.actor.id,
          time,
        }));
      } else if (e.datation.length === 1) {
        return {
          kind: e.kind,
          actor: e.actor.id,
          time: d3.timeYear(moment(e.datation[0].clean_date).toDate()),
        };
      }
    })
    .concat(
      d3.timeYear
        .range(new Date(1700, 0, 1), new Date(2000, 0, 1))
        .map((d) => ({ time: d, kind: '', actor: null }))
    )
    .groupBy('time');
});

const selectMap = createSelector(
  selectSwitch,
  selectActors,
  selectKinds,
  selectMainColor,
  selectActorColor,
  (switcher, actors, kinds, mainColor, actorColor) =>
    switcher === 'Actor'
      ? {
          countBy: 'actor',
          keys: _.map(actors, (a) => '' + a.id),
          color: actorColor,
        }
      : { countBy: 'kind', keys: _.values(kinds), color: mainColor }
);

const selectStack = createSelector(selectDiscrete, selectMap, function (
  events,
  selection
) {
  const flatten = _(events)
    .mapValues((v) => _.countBy(v, selection.countBy))
    .map((value, time) => ({ time: new Date(time), ...value }))
    .sortBy('time')
    .value();

  return {
    stack: d3
      .stack()
      .keys(selection.keys)
      .order(d3.stackOrderInsideOut)
      .value((d, k) => d[k] || 0)(flatten as any),
    color: selection.color,
  };
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
