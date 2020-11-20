import React, { useContext, useMemo, useCallback, useRef } from 'react';
import styled from 'styled-components/macro';
import GlobalGraphContext, {
  selectGetActorInformations,
} from './GlobalGraphContext';
import { useSelector } from 'react-redux';
import { selectActors } from '../../selectors/event';
import { selectSwitchActorColor } from '../../selectors/switch';
import useHoverHighlight from '../../hooks/useHoverHighlight';
import { useFlatClick } from '../../hooks/useClick';
import DetailsMenuContext from './DetailsMenuContext';
import ActorLabel from '../../components/ActorLabel';
import { ProsoVisNode } from '../../v2/types/graph';

export const StyledRect = styled.rect<{ fill?: string; stroke?: string }>`
  fill: ${({ fill }) => fill ?? 'lightgray'};
  stroke: ${({ stroke }) => stroke ?? 'black'};
`;

export const StyledText = styled.text`
  font-size: 12px;
  text-anchor: middle;
  user-select: none;
`;

function useFill(id: string) {
  const actors = useSelector(selectActors);
  const color = useSelector(selectSwitchActorColor);
  return color && actors[id] ? color(id) : undefined;
}

const ACTIVE_STROKE = 'darkgoldenrod';
const INACTIVE_OPACITY = 0.5;
const ACTIVE_STROKE_WIDTH = 3;

export const StyledGroup = styled.g<{ sOpacity?: number }>`
  opacity: ${({ sOpacity }) => sOpacity};
`;

function getFocusState<T>(index: T, sparker: T, shiner: T) {
  return shiner === index || sparker === index
    ? ACTIVE_STROKE_WIDTH
    : undefined;
}

function getHighlightState<T>(index: T, shiner: T, sparky: boolean) {
  if (sparky) {
    if (shiner === index) {
      return undefined;
    }

    return ACTIVE_STROKE;
  }

  return undefined;
}

export const GlobalGraphNode: React.FC<ProsoVisNode> = function ({
  id,
  label,
  x,
  y,
  width,
  height,
}) {
  const $ref = useRef<SVGGElement>(null as any);
  const getActorInformations = useSelector(selectGetActorInformations);

  const { actor, eventIds } = useMemo(() => getActorInformations(id), [
    id,
    getActorInformations,
  ]);
  const {
    sparker,
    shiner,
    canISpark,
    canIShine,
    setSparker,
    setShiner,
  } = useContext(GlobalGraphContext);

  const { setMenuTarget } = useContext(DetailsMenuContext);
  const interactive = useMemo(
    () => Array.from(eventIds, (id) => ({ id, kind: 'Event' })),
    [eventIds]
  );

  const highlight = useHoverHighlight(interactive);

  // event handlers
  const handleHover = useMemo(
    () => ({
      onMouseEnter: (e: React.MouseEvent<SVGGElement>) => {
        if (e.buttons === 0) {
          setSparker(id);
          highlight.onMouseEnter();
        }
      },
      onMouseLeave: () => {
        setSparker(null);
        highlight.onMouseLeave();
      },
    }),
    [id, highlight, setSparker]
  );

  const handleClick = useFlatClick(() => {
    setShiner(id);
    setMenuTarget(null);
  });

  const handleContextMenu = useCallback<React.MouseEventHandler<SVGGElement>>(
    (e) => {
      e.preventDefault();
      setMenuTarget({ actor, ref: $ref.current, x, y, width, height });
    },
    [setMenuTarget, actor, x, y, width, height]
  );

  const fill = useFill(id);
  const stroke = getHighlightState(id, shiner, canISpark(id));
  const strokeWidth = getFocusState(id, sparker, shiner);
  const opacity = canIShine(id) ? 1 : INACTIVE_OPACITY;

  return (
    <StyledGroup
      ref={$ref}
      style={{
        transform: `translate3d(${x}px, ${y}px, 0)`,
      }}
      {...handleHover}
      {...handleClick}
      onContextMenu={handleContextMenu}
      sOpacity={opacity}
    >
      <ActorLabel as="title" actor={actor} />
      <StyledRect
        width={width}
        height={height}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      ></StyledRect>
      <StyledText dx={width / 2} dy={height / 2} dominantBaseline="middle">
        {label}
      </StyledText>
    </StyledGroup>
  );
};
