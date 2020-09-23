import { map, sortBy } from 'lodash/fp';
import { computeActorShortLabel } from './getActorLabel';
import { computeEventErrors, computeEventLabels } from './getEventLabel';
import { SiprojurisEvent } from './sip-models';
import {
  AnyEvent,
  Actor,
  Datation,
  ExamenEvent,
  DirectionalExamenEvent,
} from './models';

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

export const sortDatation = sortBy<Datation>('clean_date');

export function getEvents(actor: Actor): SiprojurisEvent[] {
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

  const prepareEvents = map((e: AnyEvent) => {
    const se: SiprojurisEvent = {
      localisation: null,
      ...e,
      actor: computeActorShortLabel(e.actor),
      datation: sortDatation(e.datation),
    };

    se.computed = computeEventLabels(se);
    return se;
  });

  const ses = prepareEvents(events);

  return map((e: SiprojurisEvent) => computeEventErrors(e, ses))(ses);
}

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
