import React, { useMemo } from 'react';
import moment from 'moment';
import ContextStackedChart from './ContextStackedChart';
import ContextTimeAxis from './ContextTimeAxis';
import ContextViewBrush from './ContextViewBrush';
import ContextMaskBrush from './ContextMaskBrush';
import ContextOptions from './ContextOptions';
import * as d3 from 'd3';

const options = {
  max: '2000-01-01', //Maximum date of timeline
  min: '1700-01-01' // Minimum date of timeline
};

export const Context: React.FC<{
  mask?: [Date, Date];
  onMaskUpdate: (start: Date, end: Date) => void;
  view?: [Date, Date];
  onViewUpdate: (start: Date, end: Date) => void;
  width: number;
}> = function({ mask, onMaskUpdate, view, onViewUpdate, width }) {
  const x = useMemo(
    function() {
      return d3
        .scaleTime()
        .domain([moment(options.min), moment(options.max)])
        .range([
          ContextOptions.margin.left,
          width - ContextOptions.margin.right
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
      <ContextTimeAxis x={x} />
      <ContextStackedChart x={x} />
      <ContextMaskBrush
        onBrush={onMaskUpdate}
        width={width}
        sync={mask}
        x={x}
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
