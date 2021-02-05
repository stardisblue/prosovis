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
  (events, kinds) => pickBy(({ kind }) => kinds[kind] === undefined, events)
);

/**
 * f(x): localize
 */
const selectRichEvents = createSelector(
  selectEventsWithoutKinds,
  selectLocalisationsIndex,
  (events, localisations) => map((e) => localize(localisations, e), events)
);

/**
 * filter: map
 */
export const selectRichEventsWithoutMapBounds = createSelector(
  selectRichEvents,
  selectMaskGlobalMapBounds,
  function (events, bounds) {
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

/**
 * Exist:Time
 */
export const selectRichEventsTimed = createSelector(
  selectRichEventsWithoutMapBounds,
  filter(({ event: { datation } }) => datation.length > 0)
);

/**
 * filter: time
 */
export const selectRichEventsFiltered = createSelector(
  selectRichEventsWithoutMapBounds,
  selectMaskGlobalTime,
  function (events, bounds) {
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
 * Exist: GPS
 */
export const selectRichEventLocalised = createSelector(
  selectRichEventsFiltered,

  filter(({ place }) => hasCoordinates(place)) as (
    e: RichEvent[]
  ) => (Omit<RichEvent, 'place'> & {
    place: Omit<ProsoVisPlace, 'lng' | 'lat'> & { lat: number; lng: number };
  })[]
);
