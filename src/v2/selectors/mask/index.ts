import { isAfter, isBefore, isWithinInterval, parseISO } from 'date-fns';
import { latLngBounds } from 'leaflet';
import { filter, isNil, map, pickBy } from 'lodash/fp';
import { createSelector } from 'reselect';
import { ProsoVisEvent, RichEvent } from '../../types/events';
import { ProsoVisLocalisation, ProsoVisPlace } from '../../types/localisations';
import { selectEvents } from '../events';
import { selectLocalisationsIndex } from '../localisations';
import { selectMaskGlobalMapBounds } from './globalMapBounds';
import { selectMaskGlobalTime } from './globalTime';
import { selectActiveKinds } from './kind';

/**
 * filter: kinds
 */
export const selectEventsWithoutKinds = createSelector(
  selectEvents,
  selectActiveKinds,
  (events, kinds) =>
    events && pickBy(({ kind }) => kinds[kind] === undefined, events)
);

/**
 * f(x): localize
 */
export const selectRichEvents = createSelector(
  selectEventsWithoutKinds,
  selectLocalisationsIndex,
  (events, localisations) =>
    events && map((e) => localize(localisations, e), events)
);

/**
 * filter: map
 */
export const selectRichEventsWithoutMapBounds = createSelector(
  selectRichEvents,
  selectMaskGlobalMapBounds,
  function (events, bounds) {
    if (!events) return;
    const lBounds = bounds ? latLngBounds(bounds) : null;

    return filter(({ place }) => {
      return lBounds && hasCoordinates(place) // event has localisations
        ? // has bounds
          lBounds.contains([+place.lat!, +place.lng!])
        : true; // if is uncoordinated or bounds are not defined, then, do not filter out
    }, events);
  }
);

/* utilities for determining position and coordinates :) */

export function hasCoordinates(
  place?: ProsoVisPlace
): place is Required<ProsoVisPlace> {
  return !isNil(place?.lat) && !isNil(place?.lng);
}

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

export const selectRichEventsBackgroundTimed = createSelector(
  selectRichEventsWithoutMapBounds,
  existTime
);

/**
 * filter: time
 */
export const selectRichEventsFiltered = createSelector(
  selectRichEventsWithoutMapBounds,
  selectMaskGlobalTime,
  function (events, bounds) {
    if (!events) return;
    return filter(({ event: { datation } }) => {
      if (datation.length === 0 || isNil(bounds)) return true;

      if (datation.length === 1) {
        return isWithinInterval(parseISO(datation[0].value), bounds);
      } else {
        const [start, end] = datation;

        return !(
          isBefore(bounds.end, parseISO(start.value)) ||
          isAfter(bounds.start, parseISO(end.value))
        );
      }
    }, events);
  }
);

/**
 * Exist:Time
 */
export const selectRichEventsTimed = createSelector(
  selectRichEventsFiltered,
  existTime
);

/**
 * Exist: GPS
 */
export const selectRichEventLocalised = createSelector(
  selectRichEventsFiltered,

  (events) =>
    events &&
    (filter(({ place }) => hasCoordinates(place), events) as (Omit<
      RichEvent,
      'place'
    > & {
      place: Omit<ProsoVisPlace, 'lng' | 'lat'> & { lat: number; lng: number };
    })[])
);

/** exist: Time */
function existTime(events: RichEvent[] | undefined) {
  return (
    events && filter(({ event: { datation } }) => datation.length > 0, events)
  );
}
