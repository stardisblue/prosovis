import _ from 'lodash';
import React, { useMemo, useContext, useCallback, useEffect } from 'react';
import * as d3 from 'd3';
import { Spring, animated } from 'react-spring/renderprops';
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
        <PiePath
          key={a.data[0]}
          a={a}
          arc={arc}
          inner={donut || 0}
          outer={donut + radius}
        />
      ))}
    </g>
  );
};

export default PieChart;

export const PiePath: React.FC<{
  a: d3.PieArcDatum<[string, any[]]>;
  arc: d3.Arc<any, d3.PieArcDatum<[string, any[]]>>;
  inner: number;
  outer: number;
}> = function ({ a, arc, inner, outer }) {
  const $hover = useContext(HoverContext);
  const color = useSelector(selectSwitchColor);

  const [id, values] = a.data;

  const d = useMemo(() => arc(a)!, [arc, a]);
  const fill = useMemo(() => color(id), [color, id]);

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
      <path opacity={0.3} d={d}>
        <title>{values.length}</title>
      </path>
      <SelectedPiePath a={a} d={d} inner={inner} outer={outer}>
        <title>{values.length}</title>
      </SelectedPiePath>
    </g>
  );
};

const scale = d3.scaleSqrt();

const SelectedPiePath: React.FC<{
  a: d3.PieArcDatum<[string, any[]]>;
  d: string;
  inner: number;
  outer: number;
}> = function ({ a, d, inner, outer, children }) {
  const selected = useSelector(superSelectionAsMap);

  const animatedD = useMemo(
    () =>
      _.isEmpty(selected)
        ? d
        : d3
            .arc<d3.PieArcDatum<[string, any[]]>>()
            .innerRadius(inner)
            .outerRadius(function (d) {
              scale.range([inner, outer]);
              return scale(
                _.filter(d.data[1], ({ id }) => selected[id]).length /
                  d.data[1].length
              );
            })(a)!,
    [a, d, inner, outer, selected]
  );

  return <path d={animatedD}>{children}</path>;
};
