import { map, sortBy } from 'lodash/fp';
import {
  AnyEvent,
  Actor,
  Datation,
  ExamenEvent,
  DirectionalExamenEvent,
} from './typings';

export function getLocalisation(event: AnyEvent) {
  switch (event.kind) {
    case 'Birth':
    case 'Death':
      return event.localisation;
    case 'Education':
    case 'ObtainQualification':
    case 'PassageExamen':
      return (
        event.collective_actor &&
        (event.collective_actor.localisation || event.collective_actor.creation)
      );
    default:
      return null;
  }
}

export function getEvents(actor: Actor): AnyEvent[] {
  const events = [];

  events.push(
    ...actor.birth_set,
    ...actor.death_set,
    ...actor.education_set,
    ...map(createEvaluatedExamen, actor.est_evalue_examen),
    ...map(createEvaluatorExamen, actor.evaluer_examen),
    ...actor.retirement_set,
    ...actor.suspensionactivity_set,
    ...actor.obtainqualification_set
  );

  return orderDatation(events);
}

export const sortDatation = sortBy<Datation>('clean_date');

const orderDatation = map((e: AnyEvent) => {
  e = { ...e };
  e.datation = sortDatation(e.datation);
  return e;
});

function createEvaluatorExamen({
  actor_evaluer,
  ...rest
}: ExamenEvent): DirectionalExamenEvent {
  return {
    ...rest,
    actor_evaluer,
    actor: actor_evaluer!,
  };
}
function createEvaluatedExamen({
  id,
  actor_evalue,
  ...rest
}: ExamenEvent): DirectionalExamenEvent {
  return {
    id: -id,
    ...rest,
    actor_evalue,
    actor: actor_evalue!,
  };
}
