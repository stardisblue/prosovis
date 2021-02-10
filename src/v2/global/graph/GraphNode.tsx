import React, { MouseEvent, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import ActorLabel from '../../../components/ActorLabel';
import { useFlatClick } from '../../../hooks/useClick';
import { lightgray } from '../../components/theme';
import {
  resetGlobalHighlight,
  setGlobalHighlight,
} from '../../reducers/global/highlightSlice';
import { setGlobalSelection } from '../../reducers/global/selectionSlice';
import { ProsoVisNode } from '../../types/graph';
import { selectActorsFiltered, selectSelectedNeighbours } from './selectors';

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
  const filtered = useSelector(selectActorsFiltered);

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
  return (
    <g
      style={{
        transform: `translate3d(${x}px, ${y}px, 0)`,
        opacity: filtered
          ? filtered[id]
            ? selected
              ? selected.friends[id] || selected.actors[id]
                ? 1
                : 0.5
              : 1
            : 0.5
          : 1,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...useFlatClick(handleClick)}
    >
      <ActorLabel as="title" id={id} />
      <StyledRect
        width={width}
        height={height}
        strokeWidth={selected?.actors[id] ? 4 : undefined}
      />
      <StyledText dx={width / 2} dy={height / 2 + 1} dominantBaseline="middle">
        {label}
      </StyledText>
    </g>
  );
};
const StyledRect = styled.rect<{ fill?: string; stroke?: string }>`
  fill: ${({ fill }) => fill ?? lightgray};
  stroke: ${({ stroke }) => stroke ?? 'black'};
`;

export const StyledText = styled.text`
  font-size: 12px;
  text-anchor: middle;
  user-select: none;
`;
