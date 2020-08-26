import { AnyEvent, Nullable, Ressource } from './index';
import {
  ComputedLabels,
  SiprojurisActor,
  SiprojurisNamedPlace,
  SiprojurisEvent,
} from './types';

/**
 * Displays current string or an emtpy string
 *
 * stands for This Or Nothing
 *
 * @param strings
 * @param label
 */
function ton(strings: TemplateStringsArray, label: Nullable<Ressource>) {
  if (label) {
    return strings[0] + label.label + strings[1];
  }
  return '';
}

export function computeLabels(event: AnyEvent): ComputedLabels {
  switch (event.kind) {
    case 'Birth': {
      return {
        actorNote: ton`Naissance à ${event.localisation}`,
        placeNote: ton`Naissance de ${event.actor}`,
        actorNoteAndGrouped: ton`A ${event.localisation}`,
        placeNoteAndGrouped: ton`De ${event.actor}`,
      };
    }
    case 'Death': {
      return {
        actorNote: ton`Décès à ${event.localisation}`,
        placeNote: ton`Décès de ${event.actor}`,
        actorNoteAndGrouped: ton`A ${event.localisation}`,
        placeNoteAndGrouped: ton`De ${event.actor}`,
      };
    }
    case 'Education': {
      return {
        actorNote:
          'Enseigne' +
          ton` "${event.abstract_object}"` +
          ton` à ${event.collective_actor}`,
        placeNote:
          `${event.actor.label} enseigne` +
          ton` "${event.abstract_object}"` +
          ton` à ${event.collective_actor}`,
      };
    }
    case 'ObtainQualification': {
      return {
        actorNote:
          'Obtient la qualité' +
          ton` "${event.social_characteristic}"` +
          ton` à ${event.collective_actor}`,
        placeNote:
          `${event.actor.label} obtient la qualité` +
          ton` "${event.social_characteristic}"` +
          ton` à ${event.collective_actor}`,
      };
    }
    case 'PassageExamen': {
      const eva = (yes: string, no: string) =>
        event.actor_evaluer && event.actor.id === event.actor_evaluer.id
          ? yes
          : no;
      const rest =
        ton` "${event.abstract_object}"` + ton` à ${event.collective_actor}`;
      return {
        actorNote:
          eva(
            ton`Evalue ${event.actor_evalue}`,
            ton`Evalué par ${event.actor_evaluer}`
          ) + rest,
        placeNote:
          event.actor.label +
          eva(
            ton` evalue ${event.actor_evalue}`,
            ton` evalué par ${event.actor_evaluer}`
          ) +
          rest,
      };
    }
    case 'Retirement': {
      return {
        actorNote: 'Départ en retraite',
        placeNote: 'Départ en retraite' + `de ${event.actor.label}`,
      };
    }
    case 'SuspensionActivity': {
      return {
        actorNote: ton` ${event.abstract_object}`,
        placeNote: event.actor.label + ton` ${event.abstract_object}`,
      };
    }
  }
}

export function getLabel(
  this: SiprojurisEvent,
  noteKind: SiprojurisActor['kind'] | SiprojurisNamedPlace['kind'],
  grouped: boolean = false
): string {
  if (this.computed) {
    const {
      actorNote,
      actorNoteAndGrouped,
      placeNote,
      placeNoteAndGrouped,
    } = this.computed;
    
    if (noteKind == 'Actor') {
      // fallback to actorNote
      return (grouped && actorNoteAndGrouped) || actorNote;
    } else if (noteKind == 'NamedPlace') {
      // fallback to placeNote
      return (grouped && placeNoteAndGrouped) || placeNote;
    }
  }

  // fallback to default labellisation
  return this.label;
}
