import React from 'react';
import { getActorLabel, computeActorShortLabel } from '../data/getActorLabel';
import { SiprojurisActor, isSiprojurisActor } from '../data/sip-models';

const ActorLabel: React.FC<{
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  actor: SiprojurisActor;
  short?: boolean;
}> = function ({ as, actor, short }) {
  let display = isSiprojurisActor(actor)
    ? actor
    : computeActorShortLabel(actor);
  let Base = as ? as : React.Fragment;

  return <Base>{getActorLabel(display, short)}</Base>;
};

export default ActorLabel;
