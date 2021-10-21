import {
  curryRight,
  filter,
  first,
  flatMap,
  flow,
  get,
  last,
  map,
  maxBy,
  minBy,
  find,
  every,
  some,
  isEqual,
  inRange,
} from 'lodash/fp';
import { ProsoVisDate, ProsoVisEvent, RichEvent } from '../v2/types/events';
import { ProsoVisError } from '../v2/types/errors';

function checkDatationLength(
  event: ProsoVisEvent,
  sizes: number | { start: number; end: number } | number[] = 2
): ProsoVisError | undefined {
  const errorMsg: ProsoVisError = {
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
}
function checkDatationType(
  event: ProsoVisEvent,
  expected: ProsoVisDate['label'][]
): ProsoVisError | undefined {
  // all event.datation is one of the allowed type
  if (!every((e) => some(isEqual(e.label), expected), event.datation)) {
    return {
      kind: 'DatationType',
      message: 'Le type de(s) date(s) est incorrect',
      value: map('label', event.datation),
      expected,
      level: 'Warning',
    };
  }
}

export function checkMissingPlace(event: RichEvent): ProsoVisError | undefined {
  if (!event.place) {
    return {
      kind: 'MissingPlace',
      message: "L'evenement n'as pas de lieu défini",
      value: 'null',
      expected: 'Place',
      level: 'Warning',
    };
  }

  if (!event.place?.lat || !event.place?.lng) {
    return {
      kind: 'MissingPlaceCoordinates',
      message: "Les coordonnées GPS de l'evenement ne sont pas définis",
      value: 'null',
      expected: 'Coordonnées GPS',
      level: 'Warning',
    };
  }
}

export function checkLocalisation(event: RichEvent): ProsoVisError | undefined {
  if (!event.localisation) {
    return {
      kind: 'MissingLocalisation',
      message: "La localisation n'est pas défini",
      level: 'Warning',
      value: 'null',
      expected: 'Localisation',
    };
  }
}

function checkEventUnicity(
  event: ProsoVisEvent,
  events: RichEvent[]
): ProsoVisError | undefined {
  const subPart = filter(({ event: { kind } }) => kind === event.kind, events);
  if (subPart.length > 1) {
    return {
      kind: 'EventDuplication',
      level: 'Error',
      message: `Les evenements de ${event.kind} doivent être uniques`,
      value: subPart.length,
      expected: 1,
    };
  }
}
/**
 * @param event
 * @param keyEvents
 */
function checkBeforeBirthDatation(
  event: ProsoVisEvent,
  keyEvents: {
    birth: RichEvent[];
    death: RichEvent[];
    events: RichEvent[];
  }
): ProsoVisError | undefined {
  if (event.kind !== 'Birth') {
    const firstEventCleanDate = get('value', first(event.datation));
    const firstBirthCleanDate = flow(
      flatMap(get('event.datation')),
      minBy('value'),
      get('value')
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
  event: ProsoVisEvent,
  keyEvents: {
    birth: RichEvent[];
    death: RichEvent[];
    events: RichEvent[];
  }
): ProsoVisError | undefined {
  if (event.kind !== 'Death') {
    const lastEventCleanDate = get('value', last(event.datation));
    const lastDeathCleanDate = flow(
      flatMap(get('event.datation')),
      maxBy('value'),
      get('value')
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

export function accumulator(errors: ProsoVisError[] = []) {
  const acc = {
    add: function (check?: ProsoVisError) {
      if (check) errors.push(check);
      return acc;
    },
    addIf: function (...checks: (ProsoVisError | undefined)[]) {
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

export function prepareActorWide(events: RichEvent[]) {
  const birth = filter(({ event }) => event.kind === 'Birth', events);
  const death = filter(({ event }) => event.kind === 'Death', events);
  return { birth, death };
}

export function computeActorWideErrors(events: RichEvent[]) {
  const { birth, death } = prepareActorWide(events);

  const curried = curryRight(computeEventErrors)({ birth, death, events });
  return map(curried, events);
}

export function computeEventErrors(
  event: RichEvent,
  actorEvents: {
    birth: RichEvent[];
    death: RichEvent[];
    events: RichEvent[];
  }
) {
  const chain = accumulator([]);

  switch (event.event.kind) {
    case 'Birth': {
      chain
        .add(checkEventUnicity(event.event, actorEvents.events))
        .add(checkDatationLength(event.event, 1))
        .add(
          checkDatationType(event.event, [
            'Date unique',
            "Date unique (jusqu'à, inclus)",
          ])
        )
        .add(checkMissingPlace(event));
      break;
    }

    case 'Death': {
      chain
        .add(checkEventUnicity(event.event, actorEvents.events))
        .add(checkDatationLength(event.event, 1))
        .add(
          checkDatationType(event.event, [
            'Date unique',
            "Date unique (jusqu'à, inclus)",
          ])
        )
        .add(checkMissingPlace(event));

      break;
    }

    case 'Education': {
      chain
        .add(checkDatationLength(event.event, 2))
        .add(checkDatationType(event.event, ['Date de début', 'Date de fin']))
        .add(checkBeforeBirthDatation(event.event, actorEvents))
        .add(checkAfterDeathDatation(event.event, actorEvents));
      // TODO: fix this
      const localisationCheck = checkLocalisation(event);
      chain.add(localisationCheck);
      if (localisationCheck?.kind === 'MissingLocalisation') {
        chain.add(checkMissingPlace(event));
      }

      break;
    }

    case 'ObtainQualification': {
      chain
        .add(checkDatationLength(event.event, 1))
        .add(
          checkDatationType(event.event, [
            'Date unique',
            "Date unique (jusqu'à, inclus)",
          ])
        )
        .add(checkLocalisation(event))
        .add(checkBeforeBirthDatation(event.event, actorEvents))
        .add(checkAfterDeathDatation(event.event, actorEvents));

      break;
    }

    case 'PassageExamen': {
      chain
        .add(checkDatationLength(event.event, 1))
        .add(
          checkDatationType(event.event, [
            'Date unique',
            "Date unique (jusqu'à, inclus)",
          ])
        )
        .add(checkBeforeBirthDatation(event.event, actorEvents))
        .add(checkAfterDeathDatation(event.event, actorEvents));
      // TODO: fix this
      const localisationCheck = checkLocalisation(event);
      chain.add(localisationCheck);
      if (localisationCheck?.kind === 'MissingLocalisation') {
        chain.add(checkMissingPlace(event));
      }

      break;
    }

    case 'Retirement': {
      chain
        .add(checkDatationLength(event.event, 1))
        .add(
          checkDatationType(event.event, [
            'Date unique',
            "Date unique (jusqu'à, inclus)",
          ])
        )
        .add(checkBeforeBirthDatation(event.event, actorEvents))
        .add(checkAfterDeathDatation(event.event, actorEvents));

      break;
    }
    case 'SuspensionActivity': {
      chain
        .add(checkDatationLength(event.event, 2))
        .add(checkDatationType(event.event, ['Date de début', 'Date de fin']))
        .add(checkBeforeBirthDatation(event.event, actorEvents))
        .add(checkAfterDeathDatation(event.event, actorEvents));

      break;
    }
  }

  return chain.errors;
}
