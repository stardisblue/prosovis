import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components/macro';
import Loading from '../../components/Loading';
import { useSelector } from 'react-redux';
import { ProsoVisEvent } from '../../types/events';
import { axisBottom, scaleTime, select } from 'd3';
import { parseISO } from 'date-fns';
import useDimensions from '../../../hooks/useDimensions';
import { height, margin } from './options';
import { selectDiscrete } from './selectors';
import { keys } from 'lodash/fp';
import { StackedChart } from './StackedChart';

export const Timeline = styled.div`
  height: 200px;
`;

const GlobalTimeline: React.FC = function () {
  const $svg = useRef<SVGSVGElement>(null as any);
  const dimensions = useDimensions($svg);
  const data = useSelector(selectDiscrete);

  const width = useMemo(() => dimensions?.width, [dimensions]);

  return (
    <Loading finished={data}>
      <h3>WIP Timeline</h3>
      <svg height={height} width="100%" ref={$svg}>
        {width && <StreamGraph width={width}></StreamGraph>}
      </svg>
    </Loading>
  );
};

export const StreamGraph: React.FC<{ width: number }> = function ({ width }) {
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

  return (
    <>
      <StackedChart x={x} />
      <Axis x={x} />
    </>
  );
};

export const Axis: React.FC<{ x: d3.AxisScale<any> }> = function ({ x }) {
  const axis = useRef<d3.Selection<SVGGElement, unknown, null, undefined>>(
    null as any
  );
  const $g = useCallback((dom: SVGGElement | null) => {
    if (!dom) return;
    axis.current = select(dom);
  }, []);

  useEffect(() => {
    axis.current.call(axisBottom(x));
  }, [x]);

  return (
    <g
      ref={$g}
      className="axis"
      pointerEvents="none"
      style={{
        transform: `translate3d(0, ${
          (height - margin.bottom + margin.top) / 2
        }px, 0)`,
      }}
    />
  );
};

export default GlobalTimeline;
