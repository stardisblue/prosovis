import React from 'react';
import { getActorLabel } from '../data/getActorLabel';
import { SiprojurisActor, isSiprojurisActor } from '../data/sip-models';
import { ProsoVisActor } from '../v2/types/actors';

const ActorLabel: React.FC<{
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  actor: SiprojurisActor | ProsoVisActor;
  short?: boolean;
}> = function ({ as, actor, short }) {
  let display = isSiprojurisActor(actor) ? actor : actor;
  let Base = as ? as : React.Fragment;

  return <Base>{getActorLabel(display, short)}</Base>;
};

export default ActorLabel;
