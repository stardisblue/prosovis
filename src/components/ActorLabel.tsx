import React from 'react';
import { useSelector } from 'react-redux';
import { selectActors } from '../v2/selectors/actors';
import { ProsoVisActor } from '../v2/types/actors';

export function getActorLabel(actor: ProsoVisActor, short: boolean = false) {
  return short ? actor.shortLabel : actor.label;
}

const ActorLabel: React.FC<{
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  id: ProsoVisActor | string;
  short?: boolean;
}> = function ({ as, id: actor, short }) {
  const actors = useSelector(selectActors);
  let Base = as ? as : React.Fragment;

  if (typeof actor === 'string') {
    if (!actors) return <Base>Lel</Base>;
    actor = actors[actor];
  }
  let display = actor;

  return <Base>{getActorLabel(display, short)}</Base>;
};

export default ActorLabel;
