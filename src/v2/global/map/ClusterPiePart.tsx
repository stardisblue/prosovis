import { arc, scaleSqrt } from 'd3';
import { isEmpty, map, sumBy } from 'lodash/fp';
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFlatClick } from '../../../hooks/useClick';
import { selectSwitchKindColor } from '../../../selectors/switch';
import { darkgray } from '../../components/theme';
import {
  resetGlobalHighlight,
  setGlobalHighlight,
} from '../../reducers/global/highlightSlice';
import { setGlobalSelection } from '../../reducers/global/selectionSlice';
import { selectInteractionMap } from '../../selectors/global';
import { RichEventLocalised } from '../../selectors/mask';

export const ClusterPiePart: React.FC<{
  a: d3.PieArcDatum<[string, RichEventLocalised[]]>;
  arc: d3.Arc<any, d3.PieArcDatum<[string, RichEventLocalised[]]>>;
  radius: number;
}> = function ({ a, arc, radius }) {
  const dispatch = useDispatch();
  const color = useSelector(selectSwitchKindColor);
  const [id, values] = a.data;

  const interactive = useMemo(
    () => map(({ event: { id: event, actor } }) => ({ event, actor }), values),
    [values]
  );

  const [handleClick, handleHover, handleHoverOut] = useMemo(
    () => [
      () => {
        dispatch(setGlobalSelection(interactive)); // onclick
      },
      () => {
        dispatch(setGlobalHighlight(interactive)); // onmouseover
      },
      () => {
        dispatch(resetGlobalHighlight()); // onmouseout
      },
    ],
    [dispatch, interactive]
  );
  const d = arc(a)!;

  return (
    <g
      {...useFlatClick(handleClick)}
      onMouseEnter={handleHover}
      onMouseLeave={handleHoverOut}
      fill={color ? color(id) : darkgray}
    >
      <path opacity={0.3} d={d}>
        <title>{values.length}</title>
      </path>
      <PartialPiePart a={a} defaultD={d} radius={radius}>
        <title>{values.length}</title>
      </PartialPiePart>
    </g>
  );
};

const scale = scaleSqrt();
const arcify = arc();

const PartialPiePart: React.FC<{
  a: d3.PieArcDatum<[string, RichEventLocalised[]]>;
  defaultD: string;
  radius: number;
}> = function ({ a, defaultD, radius, children }) {
  const interaction = useSelector(selectInteractionMap);
  const {
    startAngle,
    endAngle,
    data: [, events],
  } = a;

  const d = useMemo(() => {
    if (isEmpty(interaction.events) && isEmpty(interaction.actors)) {
      return defaultD;
    }

    return arcify({
      startAngle,
      endAngle,
      innerRadius: 0,
      outerRadius:
        radius *
        scale(
          sumBy(
            ({ event }) =>
              interaction.events[event.id] || interaction.actors[event.actor]
                ? 1
                : 0,
            events
          ) / events.length
        ),
    })!;
  }, [startAngle, endAngle, events, defaultD, radius, interaction]);

  return <path d={d}>{children}</path>;
};
