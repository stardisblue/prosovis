import React, { useEffect } from 'react';
import { useSelect } from '../d3-hooks/useSelect';

export const Axis: React.FC<{
  scale: d3.AxisScale<any>;
  position: [string, string];
  axis: <Domain extends d3.AxisDomain>(
    scale: d3.AxisScale<Domain>
  ) => d3.Axis<Domain>;
}> = function ({ scale, position: [x, y], axis: axisDirection }) {
  const [selection, ref] = useSelect();

  useEffect(() => {
    selection.current.transition().call(axisDirection(scale));
  }, [selection, scale, axisDirection]);

  return (
    <g
      ref={ref}
      className="axis"
      pointerEvents="none"
      style={{
        transform: `translate3d(${x}, ${y}, 0)`,
      }}
    />
  );
};
