import { mapValues } from 'lodash/fp';
import rawNodes from './index-actors.json';
import { computeActorShortLabel } from './getActorLabel';
import { ActorCard } from './models';
import { SiprojurisActor } from './sip-models';

const indexActors: { [k: string]: SiprojurisActor } = mapValues(
  (v) => computeActorShortLabel(v),
  rawNodes as { [k: string]: ActorCard }
);

export default indexActors;
