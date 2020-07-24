import React, { useMemo, useContext, useCallback } from 'react';
import { selectSwitchColor } from '../../selectors/switch';
import { superSelectionAsMap } from '../../selectors/superHighlights';
import useHoverHighlight from '../../hooks/useHoverHighlight';
import { useSelector } from 'react-redux';
import { useClickSelect } from '../../hooks/useClick';
import { HoverContext } from './HoverContext';
import { scaleSqrt, arc } from 'd3';
import { isEmpty, sumBy, map } from 'lodash';

export const PiePath: React.FC<{
  a: d3.PieArcDatum<[string, any[]]>;
  arc: d3.Arc<any, d3.PieArcDatum<[string, any[]]>>;
  donut: number;
  radius: number;
}> = function ({ a, arc, donut, radius }) {
  const $hover = useContext(HoverContext);
  const color = useSelector(selectSwitchColor);

  const [id, values] = a.data;

  const d = useMemo(() => arc(a)!, [arc, a]);
  const fill = useMemo(() => color(id), [color, id]);

  const interactive = useMemo(
    () => map(values, ({ id }) => ({ id, kind: 'Event' })),
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
      <SelectedPiePath a={a} d={d} donut={donut} radius={radius}>
        <title>{values.length}</title>
      </SelectedPiePath>
    </g>
  );
};

export default PiePath;

const scale = scaleSqrt();
const arcify = arc();

const SelectedPiePath: React.FC<{
  a: d3.PieArcDatum<[string, any[]]>;
  d: string;
  donut: number;
  radius: number;
}> = function ({ a, d, donut, radius, children }) {
  const selected = useSelector(superSelectionAsMap);
  const {
    startAngle,
    endAngle,
    data: [, events],
  } = a;

  const animatedD = useMemo(() => {
    if (isEmpty(selected)) {
      return d;
    }

    return arcify({
      startAngle,
      endAngle,
      innerRadius: donut,
      outerRadius:
        donut +
        radius *
          scale(
            sumBy(events, ({ id }) => (selected[id] ? 1 : 0)) / events.length
          ),
    })!;
  }, [startAngle, endAngle, events, d, donut, radius, selected]);

  return <path d={animatedD}>{children}</path>;
};
