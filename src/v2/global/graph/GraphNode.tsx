import React, { MouseEvent, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import ActorLabel from '../../../components/ActorLabel';
import { useFlatClick } from '../../../hooks/useClick';
import { selectActors } from '../../../selectors/event';
import { selectSwitchActorColor } from '../../../selectors/switch';
import { lightgray, moongray, darkgray } from '../../components/theme';
import { setActorSummary } from '../../reducers/global/actorSummarySlice';
import {
  resetGlobalHighlight,
  setGlobalHighlight,
} from '../../reducers/global/highlightSlice';
import { setGlobalSelection } from '../../reducers/global/selectionSlice';
import { ProsoVisNode } from '../../types/graph';
import {
  selectActorsFiltered,
  selectHighlightNeighbours,
  selectSelectedNeighbours,
} from './selectors';

function useColor(id: string) {
  const actors = useSelector(selectActors);
  const color = useSelector(selectSwitchActorColor);

  return color && actors[id] ? color(id) : undefined;
}

export const GraphNode: React.FC<ProsoVisNode> = function ({
  id,
  label,
  x,
  y,
  width,
  height,
}) {
  const dispatch = useDispatch();
  const selected = useSelector(selectSelectedNeighbours);
  const highlighted = useSelector(selectHighlightNeighbours);
  const filtered = useSelector(selectActorsFiltered);
  const color = useColor(id);

  const { handleClick, handleMouseEnter, handleMouseLeave } = useMemo(
    () => ({
      handleClick() {
        dispatch(setGlobalSelection({ actor: id }));
      },
      handleMouseEnter(e: MouseEvent<SVGGElement>) {
        if (e.buttons === 0) {
          dispatch(setGlobalHighlight({ actor: id }));
        }
      },
      handleMouseLeave() {
        dispatch(resetGlobalHighlight());
      },
    }),
    [dispatch, id]
  );

  const handleContextMenu = useCallback(
    (e: MouseEvent<SVGGElement>) => {
      e.preventDefault();
      dispatch(setActorSummary({ x: x + width, y: y, actor: id }));
    },
    [dispatch, id, x, width, y]
  );

  const g = {
    opacity:
      highlighted?.actors[id] ||
      !filtered ||
      (filtered[id] &&
        (!selected || selected.friends[id] || selected.actors[id]))
        ? 1
        : 0.4,
  };

  const rect = {
    fill: color ?? (selected?.actors[id] ? darkgray : undefined),
    strokeWidth: highlighted?.actors[id]
      ? 4
      : selected?.actors[id]
      ? 2
      : undefined,
    stroke:
      selected?.actors[id] || highlighted?.actors[id]
        ? 'black'
        : highlighted?.friends[id]
        ? 'darkgoldenrod'
        : selected?.friends[id]
        ? 'black'
        : undefined,
  };

  const text = {
    fill: color ? undefined : selected?.actors[id] ? moongray : undefined,
  };
  return (
    <g
      style={{
        transform: `translate3d(${x}px, ${y}px, 0)`,
        ...g,
        transitionDuration: '250ms',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onContextMenu={handleContextMenu}
      {...useFlatClick(handleClick)}
    >
      <ActorLabel as="title" id={id} />
      <StyledRect width={width} height={height} {...rect} />
      <StyledText
        dx={width / 2}
        dy={height / 2 + 1}
        dominantBaseline="middle"
        style={{ ...text }}
      >
        {label}
      </StyledText>
    </g>
  );
};
const StyledRect = styled.rect<{
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}>`
  fill: ${({ fill }) => fill ?? lightgray};
  stroke: ${({ stroke }) => stroke};
  stroke-width: ${({ strokeWidth }) => strokeWidth};
`;

export const StyledText = styled.text`
  font-size: 12px;
  text-anchor: middle;
  user-select: none;
`;
