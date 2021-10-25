import { isAfter, isBefore, isWithinInterval, parseISO } from 'date-fns';
import { latLngBounds } from 'leaflet';
import { some } from 'lodash';
import { filter, get, isNil } from 'lodash/fp';
import { createSelector } from 'reselect';
import { RichEvent } from '../../types/events';
import { ProsoVisPlace } from '../../types/localisations';
import { selectRichEvents } from '../events';
import { selectCustomFilters } from './customFilter';
import { selectMaskGlobalMapBounds } from './globalMapBounds';
import { selectMaskGlobalTime } from './globalTime';
import { selectActiveKinds } from './kind';

/**
 * filter: kinds
 */
export const selectEventsWithoutKinds = createSelector(
  selectRichEvents,
  selectActiveKinds,
  selectCustomFilters,
  (events, kinds, filters) =>
    events &&
    filter(
      (richEvent) =>
        kinds[richEvent.event.kind] === undefined &&
        !some(filters, (filter, path) => {
          return filter[get(path, richEvent)] === null;
        }),
      events
    )
);

/**
 * filter: map
 */
export const selectRichEventsWithoutMapBounds = createSelector(
  selectEventsWithoutKinds,
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

export type RichEventLocalised = Omit<RichEvent, 'place'> & {
  place: Omit<ProsoVisPlace, 'lng' | 'lat'> & {
    lat: number;
    lng: number;
  };
};

/**
 * Exist: GPS
 */
export const selectRichEventLocalised = createSelector(
  selectRichEventsFiltered,

  (events) =>
    events &&
    (filter(
      ({ place }) => hasCoordinates(place),
      events
    ) as RichEventLocalised[])
);

/** exist: Time */
function existTime(events: RichEvent[] | undefined) {
  return (
    events && filter(({ event: { datation } }) => datation.length > 0, events)
  );
}
