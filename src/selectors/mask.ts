import { createSelector } from '@reduxjs/toolkit';
import { isAfter, isBefore, parseISO } from 'date-fns';
import L from 'leaflet';
import { keyBy } from 'lodash/fp';
import { RootState } from '../reducers';
import { ActorMask } from '../reducers/maskSlice';
import { selectDetailsRichEvents } from '../v2/selectors/detail/actors';
import { selectCustomFiltersFun } from '../v2/selectors/mask/customFilter';
import { selectActiveKinds } from '../v2/selectors/mask/kind';
import { ProsoVisActor } from '../v2/types/actors';
import { ProsoVisDate, ProsoVisDetailRichEvent } from '../v2/types/events';
export const selectMask = (state: RootState) => state.mask;
export const selectIntervalMask = createSelector(
  selectMask,
  (mask) => mask.interval
);

export const selectActorMask = createSelector(selectMask, (mask) => mask.actor);
export const selectBoundsMask = createSelector(
  selectMask,
  (mask) => mask.bounds
);

/** see filter:time in v2/selectors/masks */
export const selectIntervalFun = createSelector(selectIntervalMask, (res) =>
  res
    ? function ({ event: { datation } }: ProsoVisDetailRichEvent) {
        if (datation.length === 0) return true; // unbound by interval filter

        if (datation.length === 1) {
          const parsed = parseISO(datation[0].value);

          return (
            isAfter(parsed, parseISO(res.start)) &&
            isBefore(parsed, parseISO(res.end))
          );
        }
        datation = datation as [ProsoVisDate, ProsoVisDate];
        const datatStart = parseISO(datation[0].value);
        const datatEnd = parseISO(datation[1].value);

        return !(
          isBefore(parseISO(res.end), datatStart) ||
          isAfter(parseISO(res.start), datatEnd)
        );
      }
    : undefined
);

export const selectKindFun = createSelector(
  selectActiveKinds,
  (res) => (e: ProsoVisDetailRichEvent) => kindMaskState(e.event.kind, res)
);

export const selectActorFun = createSelector(selectActorMask, (res) =>
  res ? (e: ProsoVisDetailRichEvent) => actorMaskState(e.actor, res) : undefined
);

export const selectBoundsFun = createSelector(selectBoundsMask, (res) =>
  res
    ? (e: ProsoVisDetailRichEvent) => {
        const loc = e.place;
        if (loc && loc.lat !== null && loc.lng !== null) {
          return L.latLngBounds(res).contains([+loc.lat, +loc.lng]);
        } else {
          return true;
        }
      }
    : undefined
);

export const maskAllFun = createSelector(
  selectIntervalFun,
  selectKindFun,
  selectActorFun,
  selectBoundsFun,
  selectCustomFiltersFun,
  function (interval, kind, actor, bound, customFilters) {
    return (e: ProsoVisDetailRichEvent) => {
      if (!kind(e)) return false;
      if (!customFilters(e)) return false;
      if (actor && !actor(e)) return false;
      if (interval && !interval(e)) return false;
      if (bound && !bound(e)) return false;
      return true;
    };
  }
);

export const selectMaskedEvents = createSelector(
  selectDetailsRichEvents,
  maskAllFun,
  (events, maskF) => events.filter(maskF)
);

export const maskedEventsAsMap = createSelector(
  selectMaskedEvents,
  keyBy<ProsoVisDetailRichEvent>('event.id')
);

export function actorMaskState(actor: ProsoVisActor, masks?: ActorMask) {
  const state = masks && masks[actor.id];
  return state !== undefined ? state : true;
}

export function kindMaskState(kind: string, masks: _.Dictionary<string>) {
  return masks[kind] === undefined;
}
