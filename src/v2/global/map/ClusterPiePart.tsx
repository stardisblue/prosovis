import { arc, scaleSqrt } from 'd3';
import { map, sumBy } from 'lodash/fp';
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { useFlatClick } from '../../../hooks/useClick';
import { selectSwitchKindColor } from '../../../selectors/switch';
import { darkgray } from '../../components/theme';
import {
  resetGlobalHighlight,
  setGlobalHighlight,
} from '../../reducers/global/highlightSlice';
import { setGlobalSelection } from '../../reducers/global/selectionSlice';
import {
  selectIsInteractionEmpty,
  selectInteractionMap,
} from '../../selectors/global';
import { RichEventLocalised } from '../../selectors/mask';

export const ClusterPiePart: React.FC<{
  a: d3.PieArcDatum<[string, RichEventLocalised[]]>;
  arc: d3.Arc<any, d3.PieArcDatum<[string, RichEventLocalised[]]>>;
  radius: number;
}> = function ({ a, arc, radius }) {
  const dispatch = useDispatch();
  const color = useSelector(selectSwitchKindColor);
  const emptyInterector = useSelector(selectIsInteractionEmpty);
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
      <StyledPath full={emptyInterector} d={d}>
        <title>{values.length}</title>
      </StyledPath>
      {!emptyInterector && (
        <PartialPiePart a={a} defaultD={d} radius={radius}>
          <title>{values.length}</title>
        </PartialPiePart>
      )}
    </g>
  );
};

// TODO maybe better transition ?
const StyledPath = styled.path<{ full: boolean }>`
  opacity: ${({ full }) => (full ? 1 : 0.3)};
  transition: opacity 50ms;
`;

const scale = scaleSqrt();
const arcify = arc();

const PartialPiePart: React.FC<{
  a: d3.PieArcDatum<[string, RichEventLocalised[]]>;
  defaultD: string;
  radius: number;
}> = function ({ a, radius, children }) {
  const interaction = useSelector(selectInteractionMap);
  const {
    startAngle,
    endAngle,
    data: [, events],
  } = a;

  const d = useMemo(() => {
    const outerRadius =
      radius *
      scale(
        sumBy(
          ({ event }) =>
            interaction.events[event.id] || interaction.actors[event.actor]
              ? 1
              : 0,
          events
        ) / events.length
      );
    return arcify({
      startAngle,
      endAngle,
      innerRadius: 0,
      outerRadius: outerRadius < 5 && outerRadius !== 0 ? 5 : outerRadius,
    })!;
  }, [startAngle, endAngle, events, radius, interaction]);

  return <path d={d}>{children}</path>;
};
