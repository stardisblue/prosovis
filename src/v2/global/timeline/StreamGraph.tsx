import React, { useMemo } from 'react';
import { axisBottom, axisLeft, max, min, scaleLinear, scaleTime } from 'd3';
import { parseISO } from 'date-fns';
import { height, margin } from './options';
import { Tyvent } from './selectors';
import { StackedChart } from './StackedChart';
import { Dictionary } from 'lodash';
import { Axis } from '../../components/Axis';
import BrushX from '../../components/brush/BrushX';
import { useUpdateMaskGlobalTime } from './useUpdateMask';

export const StreamGraph: React.FC<{
  width: number;
  stack: d3.Series<Tyvent<Dictionary<number>>, string>[];
  color: d3.ScaleOrdinal<string, string> | null;
}> = function ({ width, stack, color }) {
  const handleBrush = useUpdateMaskGlobalTime();
  const x = useMemo(
    function () {
      return scaleTime()
        .domain([parseISO('1700-01-01'), parseISO('2000-01-01')])
        .range([margin.left, width - margin.right])
        .nice()
        .clamp(true);
    },
    [width]
  );

  const y = useMemo(
    () =>
      scaleLinear()
        .domain([
          min(stack, (d) => min(d, (d) => d[0])) as any,
          max(stack, (d) => max(d, (d) => d[1])) as any,
        ])
        .range([height - margin.bottom, margin.top]),
    [stack]
  );

  return (
    <>
      <StackedChart stack={stack} color={color} x={x} y={y} />
      <Axis
        scale={x}
        position={['0', height - margin.bottom + 'px']}
        axis={axisBottom}
      />
      <Axis scale={y} position={[margin.left + 'px', '0']} axis={axisLeft} />
      <BrushX
        width={width}
        height={height}
        margin={margin}
        x={x}
        onBrush={handleBrush}
      />
    </>
  );
};
