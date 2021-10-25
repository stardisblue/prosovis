import React, { useMemo } from 'react';
import {
  axisBottom,
  axisLeft,
  lch,
  max,
  min,
  scaleLinear,
  scaleTime,
} from 'd3';
import { parseISO } from 'date-fns';
import { Dictionary } from 'lodash';
import { useSelector } from 'react-redux';
import { selectSwitchMainColor } from '../../../selectors/switch';
import { Axis } from '../../components/Axis';
import BrushX from '../../components/brush/BrushX';
import { height, margin } from './options';
import { Tyvent } from './selectors';
import { StackedChart } from './StackedChart';
import { useUpdateMaskGlobalTime } from './useUpdateMask';
import { lightgray } from '../../components/theme';

export const StreamGraph: React.FC<{
  width: number;
  stack: d3.Series<Tyvent<Dictionary<number>>, string>[];
  reference: d3.Series<Tyvent<Dictionary<number>>, string>[];
}> = function ({ width, stack, reference }) {
  const color = useSelector(selectSwitchMainColor);

  const colorReference = useMemo(() => {
    const grayscale = color?.copy();

    if (grayscale) {
      grayscale.range(
        grayscale.range().map((c) => {
          const lchColor = lch(c);
          lchColor.c = 0;
          return lchColor.formatRgb();
        })
      );

      return grayscale;
    }
    return null;
  }, [color]);

  const handleBrush = useUpdateMaskGlobalTime();
  const x = useMemo(
    function () {
      return (
        scaleTime()
          // TODO :)
          .domain([parseISO('1700-01-01'), parseISO('2000-01-01')])
          .range([margin.left, width - margin.right])
          .nice()
          .clamp(true)
      );
    },
    [width]
  );

  const y = useMemo(
    () =>
      scaleLinear()
        .domain([
          min(reference, (d) => min(d, (d) => d[0])) as any,
          max(reference, (d) => max(d, (d) => d[1])) as any,
        ])
        .range([height - margin.bottom, margin.top]),
    [reference]
  );

  return (
    <>
      <StackedChart
        stack={reference}
        color={colorReference}
        x={x}
        y={y}
        defaultColor={lightgray}
      />
      <StackedChart stack={stack} color={color ?? null} x={x} y={y} />
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
