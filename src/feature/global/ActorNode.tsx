import React from 'react';
import { useSelector } from 'react-redux';
import { selectSwitchActorColor } from '../../selectors/switch';
import { selectActors } from '../../selectors/event';
import { StyledRect, StyledText } from './FullGraphNode';

export const ActorNode: React.FC<{
  actor: any;
  width: number;
  height: number;
}> = function ({ actor, width, height }) {
  const actors = useSelector(selectActors);
  const color = useSelector(selectSwitchActorColor);

  return (
    <>
      <title>{actor.label}</title>
      <StyledRect
        width={width}
        height={height}
        fill={color && actors[actor.id] ? color(actor.id) : undefined}
      ></StyledRect>
      <StyledText dx={width / 2} dy={height / 2}>
        {actor.label}
      </StyledText>
    </>
  );
};
