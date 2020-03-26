import _ from 'lodash';
import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { selectSwitchColor } from '../../selectors/switch';
import { superSelectionAsMap } from '../../selectors/superHighlights';
import { createSelector } from '@reduxjs/toolkit';
import useHoverHighlight from '../../hooks/useHoverHighlight';
import { useSelector } from 'react-redux';
import { useClickSelect } from '../../hooks/useClick';

const selectDimmedColor = createSelector(selectSwitchColor, color => {
  const domain = color.domain();
  const range = _.map(domain, (d: any) => color(d));

  return d3
    .scaleOrdinal<string | number, string>()
    .domain(
      _.concat(
        domain,
        _.map(domain, i => 'd:' + i)
      )
    )
    .range(
      _.concat(
        range,
        _.map(range, d => {
          const cl = d3.color(d)!;
          cl.opacity = 0.3;
          return cl.toString();
        })
      )
    );
});

export const PieChart: React.FC<{
  radius: number;
  counts: [string, any[]][];
  donut?: number;
}> = function({ radius, counts, donut = 0 }) {
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
        <PiePath key={a.data[0]} a={a} arc={arc} />
      ))}
    </g>
  );
};

export default PieChart;
export const PiePath: React.FC<{
  a: d3.PieArcDatum<[string, any[]]>;
  arc: d3.Arc<any, d3.PieArcDatum<[string, any[]]>>;
}> = function({ a, arc }) {
  const color = useSelector(selectDimmedColor);
  const selected = useSelector(superSelectionAsMap);

  const fill = useMemo(() => {
    return _.isEmpty(selected) ||
      _.some(a.data[1], ({ id }) => selected[id] !== undefined)
      ? color(a.data[0])
      : color('d:' + a.data[0]);
  }, [a.data, selected, color]);

  const interactive = useMemo(
    () => _.map(a.data[1], ({ id }) => ({ id, kind: 'Event' })),
    [a.data]
  );

  return (
    <path
      fill={fill}
      d={arc(a)!}
      {...useClickSelect(interactive)}
      {...useHoverHighlight(interactive)}
    >
      <title>{a.data[1].length}</title>
    </path>
  );
};
