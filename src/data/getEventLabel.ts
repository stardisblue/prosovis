import { ProsoVisActor } from '../v2/types/actors';
import { ProsoVisEvent } from '../v2/types/events';
import { ProsoVisPlace } from '../v2/types/localisations';

export function getEventLabel(
  event: ProsoVisEvent,
  noteKind: ProsoVisActor['kind'] | ProsoVisPlace['kind'],
  grouped: boolean = false
): string {
  if (event.computed) {
    const { actorNote, actorNoteAndGrouped, placeNote, placeNoteAndGrouped } =
      event.computed;

    if (noteKind === 'Actor') {
      // fallback to actorNote
      return (grouped && actorNoteAndGrouped) || actorNote;
    } else if (noteKind === 'NamedPlace') {
      // fallback to placeNote
      return (grouped && placeNoteAndGrouped) || placeNote;
    }
  }
  // event.computed = computeEventLabels(event);

  // if (event.computed) {
  //   return getEventLabel(event, noteKind, grouped);
  // }

  // fallback to default labellisation
  return event.label;
}

export function getKindString(kind: string) {
  switch (kind) {
    case 'Birth':
      return 'Naissances';

    case 'Death':
      return 'Décès';

    case 'Education':
      return 'Enseignements';

    case 'ObtainQualification':
      return 'Obtention de qualités';

    case 'PassageExamen':
      return 'Evaluations';

    case 'Retirement':
      return 'Départs en retraite';

    case 'SuspensionActivity':
      return "Suspensions d'activités";

    default:
      return kind;
  }
}
