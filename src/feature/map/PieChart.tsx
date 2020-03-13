import _ from 'lodash';
import React, { useMemo } from 'react';
import * as d3 from 'd3';

export const PieChart: React.FC<{
  radius: number;
  counts: [string, any[]][];
  color: any;
  donut?: number;
}> = function({ radius, counts, color, donut = 0 }) {
  const arcs = useMemo(
    () =>
      d3
        .pie<[string, any[]]>()
        .sort(null)
        .value(d => d[1].length)(counts),
    [counts]
  );
  const arc = useMemo(
    () =>
      d3
        .arc<d3.PieArcDatum<[string, any[]]>>()
        .innerRadius(donut)
        .outerRadius(donut + radius),
    [radius, donut]
  );

  return (
    <g stroke="white">
      {_.map(arcs, a => (
        <path key={a.data[0]} fill={color(a.data[0])} d={arc(a)!}>
          <title>{a.data[1].length}</title>
        </path>
      ))}
    </g>
  );
};

export default PieChart;
