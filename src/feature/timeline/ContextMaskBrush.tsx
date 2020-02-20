import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { useDispatch } from 'react-redux';
import { setIntervalMask } from '../../reducers/maskSlice';
import _ from 'lodash';
import ContextOptions from './ContextOptions';

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

  useEffect(() => {
    mask.current.brush.extent([
      [ContextOptions.margin.mask.left, ContextOptions.margin.mask.top],
      [
        width - ContextOptions.margin.mask.right,
        ContextOptions.height - ContextOptions.margin.mask.bottom
      ]
    ]);
    mask.current.selection.call(mask.current.brush);
  }, [width]);

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
      mask.current.brush.on('brush', function() {
        if (d3.event.sourceEvent && d3.event.selection) {
          const [start, end] = d3.event.selection.map(x.invert);
          onBrush(start, end);
          updateMask(start, end);
        }
      });
    },
    [onBrush, updateMask, x]
  );

  return <g id="context-filter" className="brush" ref={ref}></g>;
};

export default ContextMaskBrush;
