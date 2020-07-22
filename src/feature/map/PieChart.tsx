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

const scale = d3.scaleSqrt();

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
  const sizes = {
    inner: arc.innerRadius()(null as any),
    outer: arc.outerRadius()(null as any),
  };

  const smallD = useMemo(() => {
    return _.isEmpty(selected)
      ? ''
      : d3
          .arc<d3.PieArcDatum<[string, any[]]>>()
          .innerRadius(sizes.inner)
          .outerRadius(function (d) {
            scale.range([sizes.inner, sizes.outer]);
            return scale(
              _.filter(d.data[1], ({ id }) => selected[id]).length /
                d.data[1].length
            );
          })(a)!;
  }, [sizes, a, selected]);

  // arc.outerRadius(
  //   (arc.outerRadius() * _.filter(values, ({ id }) => selected[id]).length) /
  //     values.length
  // );

  const opacity = useMemo(() => (_.isEmpty(selected) ? 1 : 0.3), [selected]);

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
    <g
      fill={fill}
      {...useClickSelect(interactive)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <path opacity={opacity} d={d}>
        <title>{values.length}</title>
      </path>
      <path d={smallD}>
        <title>{values.length}</title>
      </path>
    </g>
  );
};
