import React, { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import ContextOptions from './ContextOptions';

type ViewReference = {
  dom: SVGGElement;
  selection: d3.Selection<SVGGElement, unknown, null, undefined>;
  brush: d3.BrushBehavior<unknown>;
};

export const ContextViewBrush: React.FC<{
  x: d3.ScaleTime<number, number>;
  width: number;
  onBrush: (start: Date, end: Date) => void;
  sync?: [Date, Date];
}> = function({ width, x, onBrush, sync }) {
  // ! assuming that ref is instantaneously populated
  const view = useRef<ViewReference>({} as any);

  const handleRef = useCallback(function(dom: SVGGElement | null) {
    if (dom === null) return;
    const brush = d3.brushX();
    const selection = d3.select(dom).call(brush);
    view.current = { dom, selection, brush };
  }, []);

  // sync width
  useEffect(
    function() {
      const { brush, selection } = view.current;

      brush.extent([
        [ContextOptions.margin.view.left, ContextOptions.margin.view.top],
        [
          width - ContextOptions.margin.view.right,
          ContextOptions.height - ContextOptions.margin.view.bottom
        ]
      ]);
      selection.call(brush);
    },
    [width]
  );

  // update brush position
  useEffect(
    function() {
      if (!sync) return;
      const { brush, selection } = view.current;

      selection.call(brush.move, sync.map(x));
    },
    [sync, x]
  );

  // notify when brush is moved
  useEffect(
    function() {
      const { brush } = view.current;

      brush.on('brush', function() {
        if (d3.event.sourceEvent && d3.event.selection) {
          const [start, end] = d3.event.selection.map(x.invert);
          onBrush(start, end);
        }
      });
    },
    [onBrush, x]
  );

  // Allows the window to be teleported when clicking on the context
  useEffect(
    function() {
      view.current.selection.call(function(g) {
        g.select('.overlay')
          .datum({ type: 'selection' })
          .on('mousedown touchstart', function(this: any) {
            const { brush, dom, selection } = view.current;

            const brushSelection = d3.brushSelection(dom) as
              | [number, number]
              | null;
            if (!brushSelection) return;

            const [start, end] = brushSelection;
            const dx = end - start;
            const [cx] = d3.mouse(this);
            const [x0, x1] = [cx - dx / 2, cx + dx / 2];
            const [X0, X1] = x.range();
            console.log(
              x1 > X1 ? [X1 - dx, X1] : x0 < X0 ? [X0, X0 + dx] : [x0, x1]
            );
            selection.call(
              brush.move,
              x1 > X1 ? [X1 - dx, X1] : x0 < X0 ? [X0, X0 + dx] : [x0, x1]
            );
          });
      });
    },
    [x]
  );
  return <g id="context-window" className="brush" ref={handleRef}></g>;
};

export default ContextViewBrush;
