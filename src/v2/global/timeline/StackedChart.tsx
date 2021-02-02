import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { area, curveMonotoneX, select } from 'd3';
import type { Dictionary } from 'lodash';
import type { Tyvent } from './selectors';
import theme from '../../components/theme';
type D3Selection = d3.Selection<SVGGElement, unknown, any, undefined>;

type EnterType = d3.Selection<
  d3.EnterElement,
  d3.Series<Tyvent<Dictionary<number>>, string>,
  SVGGElement,
  unknown
>;

type UpdateType = d3.Selection<
  SVGGElement,
  d3.Series<Tyvent<Dictionary<number>>, string>,
  SVGGElement,
  unknown
>;

function useSelect(): [
  React.MutableRefObject<D3Selection>,
  (dom: SVGGElement) => void
] {
  const d3selection = useRef<D3Selection>(null as any);
  const ref = useCallback(function (dom: SVGGElement) {
    if (!dom) return;
    d3selection.current = select(dom);
  }, []);

  return [d3selection, ref];
}

export const StackedChart: React.FC<{
  x: d3.ScaleTime<number, number>;
  y: d3.ScaleLinear<number, number>;
  stack: d3.Series<Tyvent<Dictionary<number>>, string>[];
  color: d3.ScaleOrdinal<string, string> | null;
}> = function ({ x, y, stack, color }) {
  const [chart, ref] = useSelect();

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

  const colorize = useCallback(
    (d: any) => (color ? color(d.key) : theme.darkgray),
    [color]
  );

  useEffect(() => {
    chart.current
      .selectAll<SVGGElement, d3.Series<Tyvent<Dictionary<number>>, string>>(
        'path'
      )
      .data(stack, (d) => d.key)
      .join(onEnter, onUpdate);

    function onEnter(enter: EnterType) {
      return enter
        .append('path')
        .attr('fill', colorize)
        .attr('stroke', colorize)
        .attr('d', d3Area as any)
        .call((g) => g.append('title').text((d) => d.key));
    }

    function onUpdate(update: UpdateType) {
      return update.call((g) =>
        g
          .transition()
          .attr('fill', colorize)
          .attr('stroke', colorize)
          .attr('d', d3Area as any)
          .select('title')
          .text((d: d3.Series<any, string>) => d.key)
      );
    }
  }, [chart, stack, colorize, d3Area]);

  return <g ref={ref}></g>;
};
