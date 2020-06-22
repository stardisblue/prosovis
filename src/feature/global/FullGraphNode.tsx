import React, { useMemo, useCallback } from 'react';
import styled from 'styled-components/macro';
import { selectActors } from '../../selectors/event';
import { useSelector } from 'react-redux';
import { selectSwitchActorColor } from '../../selectors/switch';
import useHoverHighlight from '../../hooks/useHoverHighlight';
import { useClickSelect } from '../../hooks/useClick';

export const StyledRect = styled.rect<{ fill?: string; stroke?: string }>`
  fill: ${({ fill }) => fill ?? 'lightgray'};
  stroke: ${({ stroke }) => stroke ?? 'black'};
`;
export const StyledText = styled.text`
  font-size: 10px;
  text-anchor: middle;
  dominant-baseline: middle;
  user-select: none;
`;

export const FullGraphNode: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  actor: any;
  events?: Set<number>;
  hover: any;
  chosen: any;
  isHighlight: any;
}> = function ({
  actor,
  events,
  x,
  y,
  width,
  height,
  hover,
  chosen,
  isHighlight,
}) {
  const actors = useSelector(selectActors);

  const color = useSelector(selectSwitchActorColor);

  const interactive = useMemo(
    () => Array.from(events ?? [], (id) => ({ id, kind: 'Event' })),
    [events]
  );
  const highlight = useHoverHighlight(interactive);

  const select = useClickSelect(interactive);

  const handleHover = useMemo(
    () => ({
      onMouseEnter: () => {
        hover(actor.id);
        highlight.onMouseEnter();
      },
      onMouseLeave: () => {
        hover(null);
        highlight.onMouseLeave();
      },
    }),
    [actor.id, highlight, hover]
  );

  const handleClick = useCallback(
    (e) => {
      chosen(actor.id);
      select.onClick(e);
    },
    [chosen, select, actor]
  );

  return (
    <g
      style={{
        transform: `translate3d(${x}px, ${y}px, 0)`,
      }}
      {...handleHover}
      onClick={handleClick}
      onMouseUp={select.onMouseUp}
    >
      <title>{actor.label}</title>
      <StyledRect
        width={width}
        height={height}
        fill={color && actors[actor.id] ? color(actor.id) : undefined}
        stroke={isHighlight(actor.id) ? 'yellow' : undefined}
      ></StyledRect>
      <StyledText dx={width / 2} dy={height / 2}>
        {actor.label}
      </StyledText>
    </g>
  );
};
