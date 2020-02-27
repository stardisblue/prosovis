import _ from 'lodash';
import React, { useMemo, useEffect } from 'react';
import * as d3 from 'd3';
import { useSelector } from 'react-redux';
import { selectMainColor } from '../../selectors/color';

export const PieChart: React.FC<{
  radius: number;
  counts: [string, number][];
  color: any;
  donut?: number;
}> = function({ radius, counts, color, donut = 0 }) {
  useEffect(() => {});

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
          <title>{a.data[0]}</title>
        </path>
      ))}
    </g>
  );
};

export default PieChart;
