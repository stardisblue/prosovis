import { flow, map, sortBy } from 'lodash/fp';
import { computeActorShortLabel } from './getActorLabel';
import { computeEventLabels } from './getEventLabel';
import { computeActorWideErrors } from './getEventErrors';
import { SiprojurisEvent } from './sip-models';
import {
  AnyEvent,
  Actor,
  Datation,
  ExamenEvent,
  DirectionalExamenEvent,
  ActorCard,
  NamedPlace,
} from './models';

export function getLocalisation<A extends ActorCard, T extends NamedPlace>(
  event: AnyEvent<A, T>
) {
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

export const sortDatation = sortBy<Datation>('clean_date');

export function getEvents(actor: Actor): SiprojurisEvent[] {
  const events: AnyEvent<ActorCard, NamedPlace>[] = [];

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

  return flow(map(convertToSiprojurisEvents), computeActorWideErrors)(events);
}

function convertToSiprojurisEvents({
  actor,
  ...e
}: AnyEvent<ActorCard, NamedPlace>): SiprojurisEvent {
  let se: SiprojurisEvent;
  if (e.kind === 'PassageExamen') {
    se = {
      ...e,
      actor_evalue: e.actor_evalue
        ? computeActorShortLabel(e.actor_evalue)
        : null,
      actor_evaluer: e.actor_evaluer
        ? computeActorShortLabel(e.actor_evaluer)
        : null,
      actor: computeActorShortLabel(actor),
    };
  } else if (e.kind === 'ObtainQualification') {
    const pe = e.passage_examen;
    const passage_examen = pe
      ? {
          ...pe,
          actor_evalue: pe.actor_evalue
            ? computeActorShortLabel(pe.actor_evalue)
            : null,
          actor_evaluer: pe.actor_evaluer
            ? computeActorShortLabel(pe.actor_evaluer)
            : null,
        }
      : null;
    se = {
      ...e,
      passage_examen,
      actor: computeActorShortLabel(actor),
    };
  } else {
    se = {
      ...e,
      actor: computeActorShortLabel(actor),
      datation: sortDatation(e.datation),
    };
  }

  se.computed = computeEventLabels(se);
  return se;
}

function createEvaluatorExamen<A extends ActorCard, T extends NamedPlace>(
  e: ExamenEvent<A, T>
): DirectionalExamenEvent<A, T> {
  return {
    ...e,
    actor: e.actor_evaluer!,
  };
}

function createEvaluatedExamen<A extends ActorCard, T extends NamedPlace>({
  id,
  ...rest
}: ExamenEvent<A, T>): DirectionalExamenEvent<A, T> {
  return {
    id: -id,
    ...rest,
    actor: rest.actor_evalue!,
  };
}
