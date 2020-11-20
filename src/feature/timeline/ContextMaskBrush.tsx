import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { useDispatch } from 'react-redux';
import { setIntervalMask } from '../../reducers/maskSlice';
import _ from 'lodash';
import ContextOptions from './ContextOptions';
import styled from 'styled-components/macro';
import { darkgray } from '../../components/ui/colors';

const StyledG = styled.g`
  .selection {
    fill-opacity: 0;
  }
`;

const height = ContextOptions.height - ContextOptions.margin.mask.bottom;

const path = d3.line().context(null)([
  [0, 0],
  [2, 0],
  [2, height - 10],
  [0, height - 10],
  [0, 0],
])!;

const brushHandles = function (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  selection: any
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
        (d: any, i: number) => `translate3d(${selection[i] - 1}px, 0, 0)`
      );
};

export const ContextMaskBrush: React.FC<{
  width: number;
  x: d3.ScaleTime<number, number>;
  onBrush: (start: Date, end: Date) => void;
  sync?: [Date, Date];
}> = function ({ width, onBrush, x, sync }) {
  // ! assuming that ref is instantaneously populated
  const mask = useRef<{
    dom: SVGGElement;
    selection: d3.Selection<SVGGElement, unknown, null, undefined>;
    brush: d3.BrushBehavior<unknown>;
  }>(null as any);
  const handleRef = useCallback(function (dom: SVGGElement) {
    if (!dom) return;
    const brush = d3.brushX();
    const selection = d3.select(dom).call(brush);
    mask.current = { dom, brush, selection };
  }, []);

  const dispatch = useDispatch();

  useEffect(
    function () {
      mask.current.selection.call(mask.current.brush.move, [
        ContextOptions.margin.mask.left,
        width - ContextOptions.margin.mask.right,
      ]);
    },
    [width]
  );

  const updateMask = useMemo(
    function () {
      return _.throttle((start: Date, end: Date) => {
        dispatch(
          setIntervalMask({
            start: start.toDateString(),
            end: end.toDateString(),
          })
        );
      }, 100);
    },
    [dispatch]
  );

  useEffect(
    function () {
      mask.current.brush.extent([
        [ContextOptions.margin.mask.left, ContextOptions.margin.mask.top],
        [
          width - ContextOptions.margin.mask.right,
          ContextOptions.height - ContextOptions.margin.mask.bottom,
        ],
      ]);
      mask.current.selection.call(brushHandles, [
        ContextOptions.margin.mask.left,
        width - ContextOptions.margin.mask.right,
      ]);
      mask.current.selection.call(mask.current.brush);
    },
    [width]
  );

  useEffect(
    function () {
      if (!sync) return;
      mask.current.selection.call(mask.current.brush.move, sync.map(x));

      updateMask(sync[0], sync[1]);
    },
    [sync, updateMask, x]
  );

  useEffect(
    function () {
      mask.current.brush.on('start brush end', function (event) {
        if (event.selection) {
          d3.select(this).call(brushHandles, event.selection);

          if (event.sourceEvent) {
            const [start, end] = event.selection.map(x.invert);
            onBrush(start, end);
            updateMask(start, end);
          }
        }
      });
    },
    [onBrush, updateMask, x]
  );

  return <StyledG id="context-filter" className="brush" ref={handleRef} />;
};

export default ContextMaskBrush;
