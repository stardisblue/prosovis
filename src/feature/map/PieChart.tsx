import _ from 'lodash';
import React, { useMemo, useContext, useCallback } from 'react';
import * as d3 from 'd3';
import { selectSwitchColor } from '../../selectors/switch';
import { superSelectionAsMap } from '../../selectors/superHighlights';
import useHoverHighlight from '../../hooks/useHoverHighlight';
import { useSelector } from 'react-redux';
import { useClickSelect } from '../../hooks/useClick';
import { HoverContext } from './HoverContext';

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
      {_.map(arcs, (a) => (
        <PiePath key={a.data[0]} a={a} arc={arc} />
      ))}
    </g>
  );
};

export default PieChart;
export const PiePath: React.FC<{
  a: d3.PieArcDatum<[string, any[]]>;
  arc: d3.Arc<any, d3.PieArcDatum<[string, any[]]>>;
}> = function ({ a, arc }) {
  const $hover = useContext(HoverContext);

  const [id, values] = a.data;
  const color = useSelector(selectSwitchColor);
  const selected = useSelector(superSelectionAsMap);

  const d = useMemo(() => arc(a)!, [arc, a]);
  const fill = useMemo(() => color(id), [color, id]);

  const opacity = useMemo(
    () =>
      _.isEmpty(selected) ||
      _.some(values, ({ id }) => selected[id] !== undefined)
        ? 1
        : 0.3,
    [values, selected]
  );

  const interactive = useMemo(
    () => _.map(values, ({ id }) => ({ id, kind: 'Event' })),
    [values]
  );

  const { onMouseEnter, onMouseLeave } = useHoverHighlight(interactive);

  const handleMouseEnter = useCallback(() => {
    if ($hover.current.cancel) $hover.current.cancel();
    onMouseEnter();
  }, [onMouseEnter, $hover]);
  const handleMouseLeave = useCallback(() => {
    $hover.current.id = null;
    onMouseLeave();
  }, [onMouseLeave, $hover]);

  return (
    <path
      fill={fill}
      opacity={opacity}
      d={d}
      {...useClickSelect(interactive)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <title>{values.length}</title>
    </path>
  );
};
