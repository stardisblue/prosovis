import { pipe, split, map, join } from 'lodash/fp';
import { isSiprojurisActor, SiprojurisActor } from './sip-models';
import { ActorCard } from './models';
import { ProsoVisActor } from '../v2/types/actors';

const splitActorLabel = split(',');
const compactFirstNames = (f: string) => f.trim().replace(/[^A-Z]+/g, '. ');
const trimFirstNames = function ([name, ...firstNames]: string[]) {
  return `${name} ${pipe(map(compactFirstNames), join(''))(firstNames).trim()}`;
};
export function computeActorShortLabel(
  actor: ActorCard | SiprojurisActor
): SiprojurisActor {
  if (isSiprojurisActor(actor)) {
    return actor;
  }

  return {
    ...actor,
    shortLabel: pipe<[string], string[], string>(
      splitActorLabel,
      trimFirstNames
    )(actor.label),
  };
}

export function getActorLabel(
  actor: SiprojurisActor | ProsoVisActor,
  short: boolean = false
) {
  return short ? actor.shortLabel : actor.label;
}
