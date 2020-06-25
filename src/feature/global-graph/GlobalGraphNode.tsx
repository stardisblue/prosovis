import React, { useContext, useMemo, useCallback } from 'react';
import styled from 'styled-components/macro';
import GlobalGraphContext, { getActorInformations } from './GlobalGraphContext';
import { useSelector } from 'react-redux';
import { selectActors } from '../../selectors/event';
import { selectSwitchActorColor } from '../../selectors/switch';
import useHoverHighlight from '../../hooks/useHoverHighlight';

export const StyledRect = styled.rect<{ fill?: string; stroke?: string }>`
  fill: ${({ fill }) => fill ?? 'lightgray'};
  stroke: ${({ stroke }) => stroke ?? 'black'};
`;
export const StyledText = styled.text`
  font-size: 12px;
  text-anchor: middle;
  dominant-baseline: middle;
  user-select: none;
`;

function useFill(id: number) {
  const actors = useSelector(selectActors);
  const color = useSelector(selectSwitchActorColor);
  return color && actors[id] ? color(id) : undefined;
}

const ACTIVE_STROKE = 'darkgoldenrod';
const INACTIVE_OPACITY = 0.5;
const ACTIVE_STROKE_WIDTH = 3;
export const GlobalGraphNode: React.FC<{
  id: number;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}> = function ({ id, label, x, y, width, height }) {
  const { actor, eventIds } = useMemo(() => getActorInformations(id), [id]);
  const context = useContext(GlobalGraphContext);

  const fill = useFill(id);
  const stroke = context.canISpark(id) ? ACTIVE_STROKE : undefined;
  const strokeWidth =
    context.shiner === id || context.sparker === id
      ? ACTIVE_STROKE_WIDTH
      : undefined;
  const opacity = context.canIShine(id) ? 1 : INACTIVE_OPACITY;

  const interactive = useMemo(
    () => Array.from(eventIds, (id) => ({ id, kind: 'Event' })),
    [eventIds]
  );
  const highlight = useHoverHighlight(interactive);

  const handleHover = useMemo(
    () => ({
      onMouseEnter: () => {
        context.setSparker(id);
        highlight.onMouseEnter();
      },
      onMouseLeave: () => {
        context.setSparker(null);
        highlight.onMouseLeave();
      },
    }),
    [id, highlight, context]
  );

  const handleClick = useCallback(() => {
    context.setShiner(id);
    // select.onClick(e);
    // setHover((state) => !state);
  }, [id, context]);

  return (
    <g
      style={{
        transform: `translate3d(${x}px, ${y}px, 0)`,
      }}
      {...handleHover}
      onClick={handleClick}
      opacity={opacity}
      // onMouseUp={select.onMouseUp}
    >
      <title>{actor.label}</title>
      <StyledRect
        width={width}
        height={height}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      ></StyledRect>
      <StyledText dx={width / 2} dy={height / 2}>
        {label}
      </StyledText>
    </g>
  );
};
