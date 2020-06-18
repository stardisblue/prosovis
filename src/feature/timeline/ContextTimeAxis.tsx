import React, { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import ContextOptions from './ContextOptions';

type AxisSelection = d3.Selection<SVGGElement, unknown, null, undefined>;

export const ContextTimeAxis: React.FC<{
  x: d3.ScaleTime<number, number>;
}> = function ({ x }) {
  // ! assuming that ref is instantaneously populated
  const axis = useRef<AxisSelection>(null as any);
  const handleRef = useCallback((dom: SVGGElement | null) => {
    if (!dom) return;
    axis.current = d3.select(dom);
  }, []);

  useEffect(() => {
    axis.current.call(d3.axisBottom(x));
  }, [x]);

  return (
    <g
      id="context-axis"
      className="axis"
      ref={handleRef}
      pointerEvents="none"
      style={{
        transform: `translate3d(0, ${
          ContextOptions.height - ContextOptions.margin.bottom
        }px, 0)`,
      }}
    ></g>
  );
};

export default ContextTimeAxis;
