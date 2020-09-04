import React from 'react';
import { getActorLabel, computeActorShortLabel } from '../data/getActorLabel';
import { SiprojurisActor, isSiprojurisActor } from '../data/sip-typings';

const ActorLabel: React.FC<{
  actor: SiprojurisActor;
  short?: boolean;
}> = function ({ actor, short }) {
  let display = isSiprojurisActor(actor)
    ? actor
    : computeActorShortLabel(actor);

  return <>{getActorLabel(display, short)}</>;
};

export default ActorLabel;
