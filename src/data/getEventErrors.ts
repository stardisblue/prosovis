import {
  curryRight,
  each,
  filter,
  first,
  flatMap,
  flow,
  get,
  last,
  map,
  maxBy,
  minBy,
  once,
  find,
} from 'lodash/fp';
import { CollectiveActor, Datation, Nullable } from './models';
import { SipError, SiprojurisEvent, SiprojurisNamedPlace } from './sip-models';

function checkDatationLength(
  event: SiprojurisEvent,
  sizes: number | { start: number; end: number } | number[] = 2
): SipError | undefined {
  // TODO : bypassing for presentation
  return undefined;
  /*
  const errorMsg: SipError = {
    kind: 'DatationLength',
    message: `Le nombre de dates est incorrect`,
    value: event.datation.length,
    expected: sizes,
    level: 'Warning',
  };
 
  if (Array.isArray(sizes)) {
    if (!some(isEqual(event.datation.length))(sizes)) return errorMsg;
  } else if (typeof sizes === 'object') {
    if (!inRange(sizes.start, sizes.end, event.datation.length))
      return errorMsg;
  } else if (event.datation.length !== sizes) {
    return errorMsg;
  }
  */
}
function checkDatationType(
  event: SiprojurisEvent,
  expected: Datation['label'][]
): SipError | undefined {
  // all event.datation is one of the allowed type
  // TODO : bypassing for presentation
  return undefined;
  /*   if (!every((e) => some(isEqual(e.label), expected), event.datation)) {
    return {
      kind: 'DatationType',
      message: 'Le type de(s) date(s) est incorrect',
      value: map('label', event.datation),
      expected,
      level: 'Warning',
    };
  } */
}

export function checkMissingLocalisation<
  E extends {
    localisation: Nullable<SiprojurisNamedPlace>;
  }
>(event: E): SipError | undefined {
  if (!event.localisation) {
    return {
      kind: 'MissingLocalisation',
      message: "L'evenement n'as pas de lieu défini",
      value: 'null',
      expected: 'NamedPlace',
      level: 'Warning',
    };
  }

  if (!event.localisation.lat || !event.localisation.lng) {
    return {
      kind: 'MissingLocalisationCoordinates',
      message: "Les coordonnées GPS de l'evenement ne sont pas définis",
      value: 'null',
      expected: 'Coordonnées GPS',
      level: 'Warning',
    };
  }
}

export function checkCollectiveActor<
  E extends {
    collective_actor: Nullable<CollectiveActor<SiprojurisNamedPlace>>;
  }
>(event: E): SipError | undefined {
  if (!event.collective_actor) {
    return {
      kind: 'MissingCollectiveActor',
      message: "L'acteur collectif n'est pas défini",
      level: 'Warning',
      value: 'null',
      expected: 'CollectiveActor',
    };
  }
  const creation = event.collective_actor.creation;
  if (!creation) {
    const loc = event.collective_actor.localisation;

    if (!loc) {
      return {
        kind: 'MissingCollectiveActorLocalisation',
        message: "La localisation de l'acteur collectif n'est pas défini",
        level: 'Warning',
        value: 'null',
        expected: 'NamedPlace',
      };
    }

    if (!loc.lat || !loc.lng) {
      return {
        kind: 'MissingCollectiveActorLocalisationCoordinates',
        message:
          "Les coordonnées GPS de l'acteur collectif ne sont pas définis",
        level: 'Warning',
        value: 'null',
        expected: 'Coordonnées GPS',
      };
    } else {
      return;
    }
  }

  if (!creation.lat || !creation.lng) {
    return {
      kind: 'MissingCollectiveActorLocalisationCoordinates',
      message:
        "Les coordonnées GPS du lieu de creation de l'acteur collectif ne sont pas définis",
      level: 'Warning',
      value: 'null',
      expected: 'Coordonnées GPS',
    };
  }
}
function checkEventUnicity(
  events: SiprojurisEvent[],
  kind: SiprojurisEvent['kind']
) {
  const subPart = filter({ kind }, events);
  if (subPart.length > 1) {
    each((b) => {
      b.errors = [
        {
          kind: 'EventDuplication',
          level: 'Error',
          message: `Les evenements de ${kind} doivent être uniques`,
          value: subPart.length,
          expected: 1,
        },
      ];
    }, subPart);
  }

  return subPart;
}
/**
 * @param event
 * @param keyEvents
 */
function checkBeforeBirthDatation(
  event: SiprojurisEvent,
  keyEvents: {
    birth: SiprojurisEvent[];
    death: SiprojurisEvent[];
    events: SiprojurisEvent[];
  }
): SipError | undefined {
  if (event.kind !== 'Birth') {
    const firstEventCleanDate = get('clean_date', first(event.datation));
    const firstBirthCleanDate = flow(
      flatMap<SiprojurisEvent, Datation>(get('datation')),
      minBy<Datation>('clean_date'),
      get('clean_date')
    )(keyEvents.birth);

    if (
      firstEventCleanDate &&
      firstBirthCleanDate &&
      firstEventCleanDate <= firstBirthCleanDate
    )
      return {
        kind: 'DatationBeforeBirth',
        level: 'Error',
        message: "L'evenement s'est produit avant la naissance",
        value: firstEventCleanDate,
        expected: `<= ${firstBirthCleanDate}`,
      };
  }
}
/**
 * @param event
 * @param keyEvents
 */
function checkAfterDeathDatation(
  event: SiprojurisEvent,
  keyEvents: {
    birth: SiprojurisEvent[];
    death: SiprojurisEvent[];
    events: SiprojurisEvent[];
  }
): SipError | undefined {
  if (event.kind !== 'Death') {
    const lastEventCleanDate = get('clean_date', last(event.datation));
    const lastDeathCleanDate = flow(
      flatMap<SiprojurisEvent, Datation>(get('datation')),
      maxBy<Datation>('clean_date'),
      get('clean_date')
    )(keyEvents.death);

    if (
      lastEventCleanDate &&
      lastDeathCleanDate &&
      lastEventCleanDate > lastDeathCleanDate
    ) {
      return {
        kind: 'DatationBeforeDeath',
        level: 'Error',
        message: "L'evenement s'est produit après la mort",
        value: lastEventCleanDate,
        expected: `> ${lastDeathCleanDate}`,
      };
    }
  }
}
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
    addIf: function (...checks: (SipError | undefined)[]) {
      const value = find((c) => c !== undefined, checks);
      if (value) errors.push(value);
      return acc;
    },
    get errors() {
      if (errors.length > 0) {
        return errors;
      }
      return undefined;
    },
  };
  return acc;
}

export function computeActorWideErrors(events: SiprojurisEvent[]) {
  const birth = checkEventUnicity(events, 'Birth');
  const death = checkEventUnicity(events, 'Death');

  const curried = curryRight(computeEventErrors)({ birth, death, events });
  return map(curried, events);
}
function computeEventErrors(
  event: SiprojurisEvent,
  actorEvents: {
    birth: SiprojurisEvent[];
    death: SiprojurisEvent[];
    events: SiprojurisEvent[];
  }
): SiprojurisEvent {
  const chain = accumulator(event.errors);

  switch (event.kind) {
    case 'Birth': {
      chain
        .add(checkDatationLength(event, 1))
        .add(
          checkDatationType(event, [
            'Date unique',
            "Date unique (jusqu'à, inclus)",
          ])
        )
        .add(checkMissingLocalisation(event));
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
        )
        .add(checkMissingLocalisation(event));

      onces[1](event);
      break;
    }

    case 'Education': {
      chain
        .add(checkDatationLength(event, 2))
        .add(checkDatationType(event, ['Date de début', 'Date de fin']))
        .add(checkBeforeBirthDatation(event, actorEvents))
        .add(checkAfterDeathDatation(event, actorEvents));
      // TODO: fix this
      const collectiveActorCheck = checkCollectiveActor(event);
      chain.add(collectiveActorCheck);
      if (collectiveActorCheck?.kind === 'MissingCollectiveActor') {
        chain.add(checkMissingLocalisation(event));
      }

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
        )
        .add(checkCollectiveActor(event))
        .add(checkBeforeBirthDatation(event, actorEvents))
        .add(checkAfterDeathDatation(event, actorEvents));

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
        )
        .add(checkBeforeBirthDatation(event, actorEvents))
        .add(checkAfterDeathDatation(event, actorEvents));
      // TODO: fix this
      const collectiveActorCheck = checkCollectiveActor(event);
      chain.add(collectiveActorCheck);
      if (collectiveActorCheck?.kind === 'MissingCollectiveActor') {
        chain.add(checkMissingLocalisation(event));
      }

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
        )
        .add(checkBeforeBirthDatation(event, actorEvents))
        .add(checkAfterDeathDatation(event, actorEvents));

      onces[5](event);
      break;
    }
    case 'SuspensionActivity': {
      chain
        .add(checkDatationLength(event, 2))
        .add(checkDatationType(event, ['Date de début', 'Date de fin']))
        .add(checkBeforeBirthDatation(event, actorEvents))
        .add(checkAfterDeathDatation(event, actorEvents));

      onces[6](event);
      break;
    }
  }

  event.errors = chain.errors;
  return event;
}
