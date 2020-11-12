import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { area, curveStep, max, min, scaleLinear, select } from 'd3';
import { useSelector } from 'react-redux';
import { height, margin } from './options';
import { selectStack } from './selectors';
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
export const StackedChart: React.FC<{
  x: d3.ScaleTime<number, number>;
}> = function ({ x }) {
  const { stack, color } = useSelector(selectStack);

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

  const d3Area = useMemo(
    function () {
      return area()
        .x((d: any) => x(d.data.time))
        .y0((d) => y(d[0]))
        .y1((d) => y(d[1]))
        .curve(curveStep);
    },
    [x, y]
  );

  const chart = useRef<D3Selection>(null as any);
  const chartRef = useCallback(function (dom: SVGGElement) {
    if (!dom) return;
    chart.current = select(dom);
  }, []);

  useEffect(() => {
    chart.current
      .selectAll('path')
      .data(stack)
      .join('path')
      .attr('fill', (d: any) => color(d.key))
      .attr('d', d3Area as any)
      .append('title')
      .text((d) => d.key);
  }, [chart, d3Area, stack, color]);

  return <g ref={chartRef}></g>;
};
