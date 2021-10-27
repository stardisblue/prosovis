import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { parseISO } from 'date-fns';
import { createSelector } from 'reselect';
import {
  selectDefaultGroupBy,
  selectSwitchIsActor,
} from '../../selectors/switch';
import { Axis } from '../../v2/components/Axis';
import BrushX from '../../v2/components/brush/BrushX';
import { fillEmpty, flatten, Tyvent } from '../../v2/global/timeline/selectors';
import {
  selectDetailActorIds,
  selectDetailsRichEvents,
} from '../../v2/selectors/detail/actors';
import { selectCustomFilterDefaultValues } from '../../v2/selectors/mask/customFilter';
import ContextOptions from './ContextOptions';
import ContextViewBrush from './ContextViewBrush';
import { ContextStackedChart } from './ContextStackedChart';

// todo date extract this
const options = {
  max: parseISO('2000-01-01'), //Maximum date of timeline
  min: parseISO('1700-01-01'), // Minimum date of timeline
};

export const selectStack = createSelector(
  selectDetailsRichEvents,
  selectDefaultGroupBy,
  selectSwitchIsActor,
  selectDetailActorIds,
  selectCustomFilterDefaultValues,
  (events, path, switcher, actors, filters) => {
    const filled = fillEmpty(events, path);
    const flattened = flatten(filled);
    return d3
      .stack<any, Tyvent<_.Dictionary<number>>, string>()
      .keys(switcher ? actors : filters)
      .order(d3.stackOrderInsideOut)
      .value((d, k) => d.value[k] || 0)(flattened);
  }
);

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
