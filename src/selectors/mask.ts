import { RootState } from '../reducers';
import { createSelector } from '@reduxjs/toolkit';
import moment from 'moment';
import L from 'leaflet';
import { ActorMask } from '../reducers/maskSlice';
import { selectActiveKinds } from '../v2/selectors/mask/kind';
import { ProsoVisActor } from '../v2/types/actors';
import { selectDetailsRichEvents } from '../v2/selectors/detail/actors';
import { ProsoVisDetailRichEvent } from '../v2/types/events';
import { keyBy } from 'lodash/fp';

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
        if (datation.length === 1) {
          return moment(datation[0].value).isBetween(res.start, res.end);
        } else {
          const datatStart = datation[0].value;
          const datatEnd = datation[1].value;

          return !(
            moment(res.end).isBefore(datatStart) ||
            moment(res.start).isAfter(datatEnd)
          );
        }
        // return _.some(datation, function({ clean_date }) {
        //   return moment(clean_date).isBetween(res.start, res.end);
        // });
      }
    : undefined
);

export const selectKindFun = createSelector(selectActiveKinds, (res) =>
  res
    ? (e: ProsoVisDetailRichEvent) => kindMaskState(e.event.kind, res)
    : undefined
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
  function (interval, kind, actor, bound) {
    return (e: ProsoVisDetailRichEvent) => {
      if (interval && !interval(e)) return false;
      if (kind && !kind(e)) return false;
      if (actor && !actor(e)) return false;
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
