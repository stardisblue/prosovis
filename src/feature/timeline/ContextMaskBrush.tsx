import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { useDispatch } from 'react-redux';
import { setIntervalMask } from '../../reducers/maskSlice';
import _ from 'lodash';
import ContextOptions from './ContextOptions';
import styled from 'styled-components';

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
  [0, 0]
])!;

const brushHandles = function(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  selection: any
) {
  const handles = g
    .selectAll('.handle--custom')
    .data<{ type: 'w' | 'e' }>([{ type: 'w' }, { type: 'e' }])
    .join(function(enter) {
      const group = enter
        .append('g')
        .attr('class', 'handle--custom')
        .attr('shape-rendering', 'crispEdges');

      // TODO: Single Color
      group
        .append('path')
        .attr('fill', (_, i) => (i === 0 ? '#6c757d' : '#6e94ff'))
        .attr('cursor', 'ew-resize')
        .attr('transform', 'translate(0, 5)')
        .attr('d', path);

      // triangle down
      group
        .append('path')
        .attr('fill', (_, i) => (i === 0 ? '#6c757d' : '#6e94ff'))
        .attr('cursor', 'ew-resize')
        .attr('transform', `translate(1, ${height - 5})`)
        .attr('d', d3.symbol().type(d3.symbolTriangle));

      // triangle up
      group
        .append('path')
        .attr('fill', (_, i) => (i === 0 ? '#6c757d' : '#6e94ff'))
        .attr('cursor', 'ew-resize')
        .attr('transform', 'rotate(180) translate(-1, -5)')
        .attr('d', d3.symbol().type(d3.symbolTriangle));
      return group;
    });

  selection === null
    ? handles.attr('transform', null)
    : handles.attr(
        'transform',
        (d: any, i: number) => `translate(${selection[i] - 1},0)`
      );
};

export const ContextMaskBrush: React.FC<{
  width: number;
  x: d3.ScaleTime<number, number>;
  onBrush: (start: Date, end: Date) => void;
  sync?: [Date, Date];
}> = function({ width, onBrush, x, sync }) {
  // ! assuming that ref is instantaneously populated
  const mask = useRef<{
    dom: SVGGElement;
    selection: d3.Selection<SVGGElement, unknown, null, undefined>;
    brush: d3.BrushBehavior<unknown>;
  }>({} as any);

  const dispatch = useDispatch();
  const ref = useCallback(function(dom: SVGGElement) {
    if (!dom) return;
    const brush = d3.brushX();
    const selection = d3.select(dom).call(brush);
    mask.current = { dom, brush, selection };
  }, []);

  useEffect(
    function() {
      mask.current.selection.call(mask.current.brush.move, [
        ContextOptions.margin.mask.left,
        width - ContextOptions.margin.mask.right
      ]);
    },
    [width]
  );

  const updateMask = useMemo(
    function() {
      return _.throttle((start: Date, end: Date) => {
        dispatch(
          setIntervalMask({
            start: start.toDateString(),
            end: end.toDateString()
          })
        );
      }, 100);
    },
    [dispatch]
  );

  useEffect(
    function() {
      mask.current.brush.extent([
        [ContextOptions.margin.mask.left, ContextOptions.margin.mask.top],
        [
          width - ContextOptions.margin.mask.right,
          ContextOptions.height - ContextOptions.margin.mask.bottom
        ]
      ]);
      mask.current.selection.call(brushHandles, [
        ContextOptions.margin.mask.left,
        width - ContextOptions.margin.mask.right
      ]);
      mask.current.selection.call(mask.current.brush);
    },
    [width]
  );

  useEffect(
    function() {
      if (!sync) return;
      mask.current.selection.call(mask.current.brush.move, sync.map(x));

      updateMask(sync[0], sync[1]);
    },
    [sync, updateMask, x]
  );

  useEffect(
    function() {
      mask.current.brush.on('start brush end', function() {
        if (d3.event.selection) {
          d3.select(this).call(brushHandles, d3.event.selection);

          if (d3.event.sourceEvent) {
            const [start, end] = d3.event.selection.map(x.invert);
            onBrush(start, end);
            updateMask(start, end);
          }
        }
      });
    },
    [onBrush, updateMask, x]
  );

  return <StyledG id="context-filter" className="brush" ref={ref} />;
};

export default ContextMaskBrush;
