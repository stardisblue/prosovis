import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { map } from 'lodash';

export const PieChart: React.FC<{
  radius: number;
  counts: [string, any[]][];
  donut?: number;
  children: (
    a: d3.PieArcDatum<[string, any[]]>,
    arc: d3.Arc<any, d3.PieArcDatum<[string, any[]]>>,
    donut: number
  ) => JSX.Element;
}> = function ({ radius, counts, donut = 0, children }) {
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
      {map(arcs, (a) => children(a, arc, donut))}
    </g>
  );
};

export default PieChart;
