import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { area, curveMonotoneX, select } from 'd3';
import { useSelector } from 'react-redux';
import { selectMainColor } from '../../../selectors/color';
import type { Dictionary } from 'lodash';
import type { Tyvent } from './selectors';
type D3Selection = d3.Selection<SVGGElement, unknown, any, undefined>;
export const StackedChart: React.FC<{
  x: d3.ScaleTime<number, number>;
  y: d3.ScaleLinear<number, number>;
  stack: d3.Series<Tyvent<Dictionary<number>>, string>[];
}> = function ({ x, y, stack }) {
  const color = useSelector(selectMainColor);

  const d3Area = useMemo(
    function () {
      return area()
        .x((d: any) => x(d.data.time))
        .y0((d) => y(d[0]))
        .y1((d) => y(d[1]))
        .curve(curveMonotoneX);
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
      .selectAll<SVGGElement, d3.Series<Tyvent<Dictionary<number>>, string>>(
        'path'
      )
      .data(stack, (d, i) => d.key)
      .join(
        (enter) =>
          enter
            .append('path')
            .attr('fill', (d: any) => color(d.key))
            .attr('d', d3Area as any)
            .append('title')
            .text((d) => d.key),
        (update) => {
          update
            .transition()
            .attr('fill', (d: any) => color(d.key))
            .attr('d', d3Area as any)
            .select('title')
            .text((d) => d.key);
          return update;
        }
      );
  }, [chart, d3Area, stack, color]);

  return <g ref={chartRef}></g>;
};
