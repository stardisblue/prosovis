import { RootState } from '../../reducers';
import { createSelector } from '@reduxjs/toolkit';
import {
  flatMap,
  identity,
  keyBy,
  map,
  mapValues,
  pipe,
  sortBy,
  uniqBy,
} from 'lodash/fp';
import { ProsoVisEvent, RichEvent } from '../types/events';
import { selectLocalisationsIndex } from './localisations';
import { ProsoVisLocalisation, ProsoVisPlace } from '../types/localisations';

export const selectEventsData = (state: RootState) => state.eventData;

export const selectEventIndex = createSelector(
  selectEventsData,
  (events) => events.events?.index
);

// export const selectEvents = createSelector(
//   selectEventIndex,
//   (events) =>
//     events &&
//     pipe(
//       flatMap(identity as (v: ProsoVisEvent[]) => ProsoVisEvent[]),
//       keyBy('id')
//     )(events as any)
// );

export const selectUniqueKinds = createSelector(
  selectEventIndex,
  (events) =>
    events &&
    pipe(
      flatMap(identity as (v: ProsoVisEvent[]) => ProsoVisEvent[]),
      uniqBy<ProsoVisEvent>('kind'),
      map('kind'),
      sortBy(identity),
      keyBy(identity)
    )(events as any)
);

/**
 * f(x): localize
 */
export const selectRichEvents = createSelector(
  selectEventIndex,
  selectLocalisationsIndex,
  (events, localisations) =>
    events &&
    mapValues((es) => es.map((e) => localize(localisations, e)), events)
);

export function localize(
  localisationsIndex: _.Dictionary<ProsoVisLocalisation> | undefined,
  event: ProsoVisEvent
): RichEvent {
  if (localisationsIndex) {
    const localisation =
      event.localisation && localisationsIndex[event.localisation]
        ? localisationsIndex[event.localisation]
        : undefined;

    if (localisation) {
      let place;
      if (localisation.kind === 'CollectiveActor') {
        if (localisation.localisation)
          place = localisationsIndex[
            localisation.localisation
          ] as ProsoVisPlace;
      } else {
        place = localisation;
      }

      return { event: event, localisation, place };
    }
  }

  return { event };
}

export const enrichEvent = localize;
