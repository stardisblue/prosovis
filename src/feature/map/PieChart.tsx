import _ from 'lodash';
import React, { useMemo } from 'react';
import * as d3 from 'd3';

export const PieChart: React.FC<{
  radius: number;
  counts: [string, number][];
  color: any;
  donut?: number;
}> = function({ radius, counts, color, donut = 0 }) {
  const arcs = useMemo(
    () =>
      d3
        .pie<[string, number]>()
        .sort(null)
        .value(d => d[1])(counts),
    [counts]
  );
  const arc = useMemo(
    () =>
      d3
        .arc()
        .innerRadius(donut)
        .outerRadius(donut + radius),
    [radius, donut]
  );

  return (
    <g stroke="white">
      {_.map(arcs, a => (
        <path key={a.data[0]} fill={color(a.data[0])} d={arc(a as any)!}>
          <title>{a.data[1]}</title>
        </path>
      ))}
    </g>
  );
};

export default PieChart;
