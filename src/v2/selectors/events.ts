import { RootState } from '../../reducers';
import { createSelector } from '@reduxjs/toolkit';
import { identity, keyBy, map, pipe, sortBy, uniqBy, groupBy } from 'lodash/fp';
import { ProsoVisEvent, RichEvent } from '../types/events';
import { selectLocalisationsIndex } from './localisations';
import { ProsoVisLocalisation, ProsoVisPlace } from '../types/localisations';

export const selectEventsData = (state: RootState) => state.eventData.events;

export const selectRichEvents = createSelector(
  selectEventsData,
  selectLocalisationsIndex,
  (events, localisations) =>
    events && map((e) => localize(localisations, e), events)
);

export const selectEventIndex = createSelector(
  selectRichEvents,
  (events) => events && groupBy('event.actor', events)
);

export const selectUniqueKinds = createSelector(
  selectEventsData,
  (events) =>
    events &&
    pipe(
      uniqBy<ProsoVisEvent>('kind'),
      map('kind'),
      sortBy(identity),
      keyBy(identity)
    )(events)
);

/**
 * f(x): localize
 */

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
      if (localisation.kind === 'Localisation') {
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
