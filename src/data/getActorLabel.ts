import { pipe, split, map, join } from 'lodash/fp';
import { isSiprojurisActor, SiprojurisActor } from './sip-typings';
import { ActorCard } from './typings';

const splitActorLabel = split(',');
const compactFirstNames = (f: string) => f.trim().replace(/[^A-Z]+/g, '. ');
const trimFirstNames = function ([name, ...firstNames]: string[]) {
  return (
    name +
    pipe<[string[]], string[], string>(
      map(compactFirstNames),
      join('')
    )(firstNames).trim()
  );
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

export function getActorLabel(actor: SiprojurisActor, short: boolean = false) {
  return short ? actor.label : actor.shortLabel;
}
