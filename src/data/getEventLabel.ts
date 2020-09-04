import { getActorLabel } from './getActorLabel';
import { Nullable, Ressource } from './types';
import {
  ComputedLabels,
  SiprojurisActor,
  SiprojurisEvent,
  SiprojurisNamedPlace,
} from './sip-types';

/**
 * Displays current string or an emtpy string
 *
 * stands for This Or Nothing
 *
 * @param strings
 * @param label
 */
function ton<T extends Ressource>(
  strings: TemplateStringsArray,
  label: Nullable<T> | [Nullable<T>, (o: T) => string]
) {
  if (label === null) {
    return '';
  }

  if (Array.isArray(label)) {
    const [fun, ress] = label;
    if (fun === null) {
      return '';
    }
    return strings[0] + ress(fun) + strings[1];
  }

  return strings[0] + label.label + strings[1];
}

export function computeEventLabels(event: SiprojurisEvent): ComputedLabels {
  switch (event.kind) {
    case 'Birth': {
      return {
        actorNote: ton`Naissance Ã  ${event.localisation}`,
        placeNote: ton`Naissance de ${event.actor}`,
        actorNoteAndGrouped: ton`A ${event.localisation}`,
        placeNoteAndGrouped: ton`De ${event.actor}`,
      };
    }
    case 'Death': {
      return {
        actorNote: ton`DÃ©cÃ¨s Ã  ${event.localisation}`,
        placeNote: ton`DÃ©cÃ¨s de ${event.actor}`,
        actorNoteAndGrouped: ton`A ${event.localisation}`,
        placeNoteAndGrouped: ton`De ${event.actor}`,
      };
    }
    case 'Education': {
      return {
        actorNote:
          'Enseigne' +
          ton` "${event.abstract_object}"` +
          ton` Ã  ${event.collective_actor}`,
        placeNote:
          `${getActorLabel(event.actor)} enseigne` +
          ton` "${event.abstract_object}"` +
          ton` Ã  ${event.collective_actor}`,
      };
    }
    case 'ObtainQualification': {
      return {
        actorNote:
          'Obtient la qualitÃ©' +
          ton` "${event.social_characteristic}"` +
          ton` Ã  ${event.collective_actor}`,
        placeNote:
          `${getActorLabel(event.actor)} obtient la qualitÃ©` +
          ton` "${event.social_characteristic}"` +
          ton` Ã  ${event.collective_actor}`,
      };
    }
    case 'PassageExamen': {
      const eva = (yes: string, no: string) =>
        event.actor_evaluer && event.actor.id === event.actor_evaluer.id
          ? yes
          : no;
      const rest =
        ton` "${event.abstract_object}"` + ton` Ã  ${event.collective_actor}`;
      return {
        actorNote:
          eva(
            ton`Evalue ${event.actor_evalue}`,
            ton`EvaluÃ© par ${event.actor_evaluer}`
          ) + rest,
        placeNote:
          getActorLabel(event.actor) +
          eva(
            ton` evalue ${event.actor_evalue}`,
            ton` evaluÃ© par ${event.actor_evaluer}`
          ) +
          rest,
      };
    }
    case 'Retirement': {
      return {
        actorNote: 'DÃ©part en retraite',
        placeNote: 'DÃ©part en retraite' + `de ${getActorLabel(event.actor)}`,
      };
    }
    case 'SuspensionActivity': {
      return {
        actorNote: ton` ${event.abstract_object}`,
        placeNote: getActorLabel(event.actor) + ton` ${event.abstract_object}`,
      };
    }
  }
}

export function getEventLabel(
  event: SiprojurisEvent,
  noteKind: SiprojurisActor['kind'] | SiprojurisNamedPlace['kind'],
  grouped: boolean = false
): string {
  if (event.computed) {
    const {
      actorNote,
      actorNoteAndGrouped,
      placeNote,
      placeNoteAndGrouped,
    } = event.computed;

    if (noteKind == 'Actor') {
      // fallback to actorNote
      return (grouped && actorNoteAndGrouped) || actorNote;
    } else if (noteKind == 'NamedPlace') {
      // fallback to placeNote
      return (grouped && placeNoteAndGrouped) || placeNote;
    }
  }
  event.computed = computeEventLabels(event);

  if (event.computed) {
    return getEventLabel(event, noteKind, grouped);
  }

  // fallback to default labellisation
  return event.label;
}
