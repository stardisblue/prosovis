import * as d3 from 'd3';
import { darkgray } from '../theme';

export const brushHandles = function (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  selection: [number, number],
  path: string,
  height: number
) {
  const handles = g
    .selectAll('.handle--custom')
    .data<{ type: 'w' | 'e' }>([{ type: 'w' }, { type: 'e' }])
    .join(function (enter) {
      const group = enter
        .append('g')
        .attr('class', 'handle--custom')
        .attr('shape-rendering', 'crispEdges');

      group
        .append('path')
        .attr('fill', darkgray)
        .attr('cursor', 'ew-resize')
        .attr('d', path)
        .style('transform', 'translate3d(0, 5px, 0)');

      // triangle down
      group
        .append('path')
        .attr('fill', darkgray)
        .attr('cursor', 'ew-resize')
        .attr('d', d3.symbol().type(d3.symbolTriangle))
        .style('transform', `translate3d(1px, ${height - 5}px, 0)`);

      // triangle up
      group
        .append('path')
        .attr('fill', darkgray)
        .attr('cursor', 'ew-resize')
        .attr('d', d3.symbol().type(d3.symbolTriangle))
        .style('transform', 'rotate(180deg) translate3d(-1px, -5px, 0)');
      return group;
    });

  selection === null
    ? handles.style('transform', null)
    : handles.style(
        'transform',
        (_d: any, i: number) => `translate3d(${selection[i] - 1}px, 0, 0)`
      );
};
