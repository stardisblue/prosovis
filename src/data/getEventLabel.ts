import { InformationGroup } from '../v2/detail/information/types';
import { ProsoVisEvent } from '../v2/types/events';

export function getEventLabel(
  event: ProsoVisEvent,
  noteKind: InformationGroup['kind'],
  grouped: boolean = false
): string {
  if (event.computed) {
    const { actorNote, actorNoteAndGrouped, placeNote, placeNoteAndGrouped } =
      event.computed;

    if (noteKind === 'ActorNote') {
      // fallback to actorNote or event.label
      return (grouped && actorNoteAndGrouped) || actorNote || event.label;
    } else if (noteKind === 'PlaceNote') {
      // fallback to placeNote or event.label
      return (grouped && placeNoteAndGrouped) || placeNote || event.label;
    }
  }

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
