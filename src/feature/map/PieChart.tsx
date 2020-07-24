import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { PiePath } from './PiePath';
import { map } from 'lodash';

export const PieChart: React.FC<{
  radius: number;
  counts: [string, any[]][];
  donut?: number;
}> = function ({ radius, counts, donut = 0 }) {
  const arcs = useMemo(
    () =>
      d3
        .pie<[string, any[]]>()
        .sort(null)
        .value((d) => d[1].length)(counts),
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
    <g stroke="white" pointerEvents="initial">
      {map(arcs, (a) => (
        <PiePath
          key={a.data[0]}
          a={a}
          arc={arc}
          donut={donut || 0}
          radius={radius}
        />
      ))}
    </g>
  );
};

export default PieChart;
