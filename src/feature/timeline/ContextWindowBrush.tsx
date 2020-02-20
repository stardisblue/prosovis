import React, { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';

type WindowReference = {
  dom: SVGGElement;
  selection: d3.Selection<SVGGElement, unknown, null, undefined>;
  brush: d3.BrushBehavior<unknown>;
};

export const ContextWindowBrush: React.FC<{
  x: d3.ScaleTime<number, number>;
  width: number;
  onBrush: any;
  windowSync?: [Date, Date];
  margins: { top: number; right: number; bottom: number; left: number };
  dimensions: { width: string; height: number };
}> = function({ width, x, onBrush, windowSync, margins, dimensions }) {
  // ! assuming that ref is instantaneously populated
  const window = useRef<WindowReference>({} as any);

  const handleRef = useCallback(function(dom: SVGGElement | null) {
    if (dom === null) return;
    const brush = d3.brushX();
    const selection = d3.select(dom).call(brush);
    window.current = { dom, selection, brush };
  }, []);

  // sync width
  useEffect(() => {
    window.current.brush.extent([
      [margins.left, margins.top],
      [width - margins.right, dimensions.height - margins.bottom]
    ]);
    window.current.selection.call(window.current.brush);
  }, [width, window, margins, dimensions]);

  // update brush position
  useEffect(() => {
    if (!windowSync) return;
    window.current.selection.call(window.current.brush.move, windowSync.map(x));
  }, [window, windowSync, x]);

  // notify when brush is moved
  useEffect(() => {
    window.current.brush.on('brush', function() {
      if (d3.event.sourceEvent && d3.event.selection) {
        onBrush(d3.event.selection.map(x.invert));
      }
    });
  }, [window, onBrush, x]);
  // Allows the window to be teleported when clicking on the context
  useEffect(() => {
    if (!window) return;
    window.current.selection.call(function(g) {
      g.select('.overlay')
        .datum({ type: 'selection' })
        .on('mousedown touchstart', function(this: any) {
          const brushSelection = d3.brushSelection(window.current.dom) as
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
          window.current.selection.call(
            window.current.brush.move,
            x1 > X1 ? [X1 - dx, X1] : x0 < X0 ? [X0, X0 + dx] : [x0, x1]
          );
        });
    });
  }, [window, x]);
  return <g id="context-window" className="brush" ref={handleRef}></g>;
};
