import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { useSelector } from 'react-redux';
import { selectSwitchColor } from '../../selectors/switch';
import { StackedChart } from '../../v2/global/timeline/StackedChart';
import ContextOptions from './ContextOptions';
import { selectStack } from './Context';

export const ContextStackedChart: React.FC<{
  x: d3.ScaleTime<number, number>;
}> = function ({ x }) {
  const stack = useSelector(selectStack);
  const color = useSelector(selectSwitchColor);

  const y = useMemo(
    function () {
      return (
        d3
          .scalePow()
          .domain([
            d3.min(stack, (d) => d3.min(d, (d) => d[0])) as any,
            d3.max(stack, (d) => d3.max(d, (d) => d[1])) as any,
          ])
          // .nice()
          .range([
            ContextOptions.height - ContextOptions.margin.bottom,
            ContextOptions.margin.top,
          ])
      );
    },
    [stack]
  );

  return (
    <StackedChart
      x={x}
      y={y}
      stack={stack}
      color={color}
      curve={d3.curveStep}
    />
  );
};
