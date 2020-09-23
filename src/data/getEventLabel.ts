import {
  every,
  flow,
  get,
  inRange,
  isEqual,
  join,
  map,
  once,
  overEvery,
  some,
} from 'lodash/fp';
import { getActorLabel } from './getActorLabel';
import { Datation, Nullable, Ressource } from './models';
import {
  ComputedLabels,
  SipError,
  SiprojurisActor,
  SiprojurisEvent,
  SiprojurisNamedPlace,
} from './sip-models';

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
  label: Nullable<T>
) {
  if (label === null) {
    return '';
  }

  return strings[0] + label.label + strings[1];
}

export function computeEventLabels(event: SiprojurisEvent): ComputedLabels {
  switch (event.kind) {
    case 'Birth': {
      return {
        actorNote: 'Naissance' + ton` à ${event.localisation}`,
        placeNote: `Naissance de ${getActorLabel(event.actor, true)}`,
        actorNoteAndGrouped: ton`A ${event.localisation}`,
        placeNoteAndGrouped: `De ${getActorLabel(event.actor, true)}`,
      };
    }
    case 'Death': {
      return {
        actorNote: 'Décès' + ton` à ${event.localisation}`,
        placeNote: `Décès de ${getActorLabel(event.actor, true)}`,
        actorNoteAndGrouped: ton`A ${event.localisation}`,
        placeNoteAndGrouped: `De ${getActorLabel(event.actor, true)}`,
      };
    }
    case 'Education': {
      return {
        actorNote:
          'Enseigne' +
          ton` "${event.abstract_object}"` +
          ton` à ${event.collective_actor}`,
        placeNote:
          `${getActorLabel(event.actor, true)} enseigne` +
          ton` "${event.abstract_object}"` +
          ton` à ${event.collective_actor}`,
        actorNoteAndGrouped:
          ton` "${event.abstract_object}"` + ton` à ${event.collective_actor}`,
        placeNoteAndGrouped:
          getActorLabel(event.actor, true) +
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
          `${getActorLabel(event.actor, true)} obtient la qualité` +
          ton` "${event.social_characteristic}"` +
          ton` à ${event.collective_actor}`,
        actorNoteAndGrouped:
          ton` "${event.social_characteristic}"` +
          ton` à ${event.collective_actor}`,
        placeNoteAndGrouped:
          getActorLabel(event.actor, true) +
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
          getActorLabel(event.actor, true) +
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
        placeNote: `Départ en retraite de ${getActorLabel(event.actor, true)}`,
      };
    }
    case 'SuspensionActivity': {
      return {
        actorNote: ton` ${event.abstract_object}`,
        placeNote:
          getActorLabel(event.actor, true) + ton` ${event.abstract_object}`,
      };
    }
  }
}

function checkDatationLength(
  event: SiprojurisEvent,
  sizes: number | { start: number; end: number } | number[] = 2
): SipError | undefined {
  const errorMsg: SipError = {
    kind: 'DatationLength',
    message: `Incorrect number of dates`,
    value: event.datation.length,
    expected: sizes,
    level: 'Error',
  };

  if (Array.isArray(sizes)) {
    if (!some(isEqual(event.datation.length))(sizes)) return errorMsg;
  } else if (typeof sizes === 'object') {
    if (!inRange(sizes.start, sizes.end, event.datation.length))
      return errorMsg;
  } else if (event.datation.length !== sizes) {
    return errorMsg;
  }
}

function checkDatationType(
  event: SiprojurisEvent,
  expected: Datation['label'][]
): SipError | undefined {
  // all event.datation is one of the allowed type
  if (!every((e) => some(e.label, expected), event.datation)) {
    return {
      kind: 'DatationType',
      message: 'Inaccurate date type',
      value: flow(map('label'), join(', '))(event.datation),
      expected,
      level: 'Warning',
    };
  }
}

// function checkIncoherentDatation() {}

const onces = [
  once(console.log),
  once(console.log),
  once(console.log),
  once(console.log),
  once(console.log),
  once(console.log),
  once(console.log),
];

export function accumulator(errors: SipError[] = []) {
  const acc = {
    add: function (check?: SipError) {
      if (check) errors.push(check);
      return acc;
    },
    errors,
  };
  return acc;
}

export function computeEventErrors(
  event: SiprojurisEvent,
  actorEvents: SiprojurisEvent[]
): SiprojurisEvent {
  const chain = accumulator();

  switch (event.kind) {
    case 'Birth': {
      chain
        .add(checkDatationLength(event, 1))
        .add(
          checkDatationType(event, [
            'Date unique',
            "Date unique (jusqu'à, inclus)",
          ])
        );
      onces[0](event);
      break;
    }

    case 'Death': {
      chain
        .add(checkDatationLength(event, 1))
        .add(
          checkDatationType(event, [
            'Date unique',
            "Date unique (jusqu'à, inclus)",
          ])
        );
      onces[1](event);
      break;
    }

    case 'Education': {
      chain
        .add(checkDatationLength(event, 2))
        .add(checkDatationType(event, ['Date de début', 'Date de fin']));

      onces[2](event);
      break;
    }

    case 'ObtainQualification': {
      chain
        .add(checkDatationLength(event, 1))
        .add(
          checkDatationType(event, [
            'Date unique',
            "Date unique (jusqu'à, inclus)",
          ])
        );

      onces[3](event);
      break;
    }

    case 'PassageExamen': {
      chain
        .add(checkDatationLength(event, 1))
        .add(
          checkDatationType(event, [
            'Date unique',
            "Date unique (jusqu'à, inclus)",
          ])
        );

      onces[4](event);
      break;
    }

    case 'Retirement': {
      chain
        .add(checkDatationLength(event, 1))
        .add(
          checkDatationType(event, [
            'Date unique',
            "Date unique (jusqu'à, inclus)",
          ])
        );

      onces[5](event);
      break;
    }
    case 'SuspensionActivity': {
      chain
        .add(checkDatationLength(event, 2))
        .add(checkDatationType(event, ['Date de début', 'Date de fin']));

      onces[6](event);
      break;
    }
  }

  event.errors = chain.errors;
  return event;
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

    if (noteKind === 'Actor') {
      // fallback to actorNote
      return (grouped && actorNoteAndGrouped) || actorNote;
    } else if (noteKind === 'NamedPlace') {
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

    default: {
      return 'Inconnue';
    }
  }
}
