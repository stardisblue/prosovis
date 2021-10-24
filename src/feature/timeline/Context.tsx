import React, { useMemo } from 'react';
import ContextStackedChart from './ContextStackedChart';
import ContextViewBrush from './ContextViewBrush';
import ContextOptions from './ContextOptions';
import * as d3 from 'd3';
import BrushX from '../../v2/components/brush/BrushX';
import { Axis } from '../../v2/components/Axis';
import { parseISO } from 'date-fns';

// todo extract this
const options = {
  max: parseISO('2000-01-01'), //Maximum date of timeline
  min: parseISO('1700-01-01'), // Minimum date of timeline
};

export const Context: React.FC<{
  mask?: [Date, Date];
  onMaskUpdate: (start: Date, end: Date) => void;
  view?: [Date, Date];
  onViewUpdate: (start: Date, end: Date) => void;
  width: number;
}> = function ({ mask, onMaskUpdate, view, onViewUpdate, width }) {
  const x = useMemo(
    function () {
      return d3
        .scaleTime()
        .domain([options.min, options.max])
        .range([
          ContextOptions.margin.left,
          width - ContextOptions.margin.right,
        ])
        .nice()
        .clamp(true);
    },
    [width]
  );
  return (
    <svg
      id="timeline-context"
      width="100%"
      height={ContextOptions.height + 'px'}
    >
      <Axis
        scale={x}
        position={[
          '0',
          ContextOptions.height - ContextOptions.margin.bottom + 'px',
        ]}
        axis={d3.axisBottom}
      />
      <ContextStackedChart x={x} />
      <BrushX
        x={x}
        sync={mask}
        onBrush={onMaskUpdate}
        width={width}
        height={ContextOptions.height}
        margin={ContextOptions.margin.mask}
      />
      <ContextViewBrush
        onBrush={onViewUpdate}
        width={width}
        sync={view}
        x={x}
      />
    </svg>
  );
};
