import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components/macro';
import Loading from '../../components/Loading';
import { useSelector } from 'react-redux';
import {
  axisBottom,
  axisLeft,
  max,
  min,
  scaleLinear,
  scaleTime,
  select,
  stack,
  stackOrderAscending,
} from 'd3';
import { parseISO } from 'date-fns';
import useDimensions from '../../../hooks/useDimensions';
import { height, margin } from './options';
import { selectDiscrete, Tyvent } from './selectors';
import { StackedChart } from './StackedChart';
import { countBy, map, pipe, sortBy, values } from 'lodash/fp';
import type { Dictionary } from 'lodash';
import { selectAllKinds } from '../../selectors/events';
import { selectSwitchKindColor } from '../../../selectors/switch';

export const Timeline = styled.div`
  height: ${height}px;
`;

const GlobalTimeline: React.FC = function () {
  const $svg = useRef<SVGSVGElement>(null as any);
  const dimensions = useDimensions($svg);

  const width = useMemo(() => dimensions?.width, [dimensions]);

  const events = useSelector(selectDiscrete);
  const kinds = useSelector(selectAllKinds);

  const st = useMemo(
    () =>
      stack<any, Tyvent<Dictionary<number>>, string>()
        .keys(values(kinds))
        // .offset(stackOffsetSilhouette)
        .order(stackOrderAscending)
        .value((d, k) => d.value[k] || 0)(flatten(events)),
    [events, kinds]
  );
  const color = useSelector(selectSwitchKindColor);

  return (
    <Loading finished={st}>
      <svg height={height} width="100%" ref={$svg}>
        {width && <StreamGraph width={width} stack={st} color={color} />}
      </svg>
    </Loading>
  );
};

const flatten = pipe(
  map<Tyvent<Tyvent<string>[]>, Tyvent<Dictionary<number>>>(
    ({ time, value }) => ({
      time,
      value: countBy('value', value),
    })
  ),
  sortBy<Tyvent<Dictionary<number>>>('time')
);

export const StreamGraph: React.FC<{
  width: number;
  stack: d3.Series<Tyvent<Dictionary<number>>, string>[];
  color: d3.ScaleOrdinal<string, string> | null;
}> = function ({ width, stack, color }) {
  const x = useMemo(
    function () {
      return scaleTime()
        .domain([parseISO('1700-01-01'), parseISO('2000-01-01')])
        .range([margin.left, width - margin.right])
        .nice()
        .clamp(true);
    },
    [width]
  );

  const y = useMemo(
    () =>
      scaleLinear()
        .domain([
          min(stack, (d) => min(d, (d) => d[0])) as any,
          max(stack, (d) => max(d, (d) => d[1])) as any,
        ])
        // .nice()
        .range([height - margin.bottom, margin.top]),
    [stack]
  );

  return (
    <>
      <StackedChart x={x} y={y} stack={stack} color={color} />
      <Axis
        scale={x}
        position={['0', height - margin.bottom + 'px']}
        axis={axisBottom}
      />
      <Axis scale={y} position={[margin.left + 'px', '0']} axis={axisLeft} />
    </>
  );
};

export const Axis: React.FC<{
  scale: d3.AxisScale<any>;
  position: [string, string];
  axis: <Domain extends d3.AxisDomain>(
    scale: d3.AxisScale<Domain>
  ) => d3.Axis<Domain>;
}> = function ({ scale: x, position, axis: axisDirection }) {
  const axis = useRef<d3.Selection<SVGGElement, unknown, null, undefined>>(
    null as any
  );
  const $g = useCallback((dom: SVGGElement | null) => {
    if (!dom) return;
    axis.current = select(dom);
  }, []);

  useEffect(() => {
    axis.current.transition().call(axisDirection(x));
  }, [x, axisDirection]);

  return (
    <g
      ref={$g}
      className="axis"
      pointerEvents="none"
      style={{
        transform: `translate3d(${position[0]}, ${position[1]}, 0)`,
      }}
    />
  );
};

export default GlobalTimeline;
