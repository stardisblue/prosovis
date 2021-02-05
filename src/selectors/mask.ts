import { RootState } from '../reducers';
import { createSelector } from '@reduxjs/toolkit';
import { getLocalisation } from '../data';
import moment from 'moment';
import _ from 'lodash';
import { selectEvents } from './event';
import L from 'leaflet';
import { ActorMask } from '../reducers/maskSlice';
import { SiprojurisEvent } from '../data/sip-models';
import { selectActiveKinds } from '../v2/selectors/mask/kind';

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
    ? function ({ datation }: SiprojurisEvent) {
        if (datation.length === 1) {
          return moment(datation[0].clean_date).isBetween(res.start, res.end);
        } else {
          const datatStart = datation[0].clean_date;
          const datatEnd = datation[1].clean_date;

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
  res ? (e: SiprojurisEvent) => kindMaskState(e.kind, res) : undefined
);

export const selectActorFun = createSelector(selectActorMask, (res) =>
  res ? (e: SiprojurisEvent) => actorMaskState(e.actor, res) : undefined
);

export const selectBoundsFun = createSelector(selectBoundsMask, (res) =>
  res
    ? (e: SiprojurisEvent) => {
        const loc = getLocalisation(e);
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
    return (e: SiprojurisEvent) => {
      if (interval && !interval(e)) return false;
      if (kind && !kind(e)) return false;
      if (actor && !actor(e)) return false;
      if (bound && !bound(e)) return false;
      return true;
    };
  }
);

export const selectMaskedEvents = createSelector(
  selectEvents,
  maskAllFun,
  (events, maskF) => _.filter(events, maskF)
);

export const maskedEventsAsMap = createSelector(selectMaskedEvents, (events) =>
  _.keyBy(events, 'id')
);

export function actorMaskState(
  actor: SiprojurisEvent['actor'],
  masks?: ActorMask
) {
  const state = masks && masks[actor.id];
  return state !== undefined ? state : true;
}

export function kindMaskState(kind: string, masks: _.Dictionary<string>) {
  return masks[kind] === undefined;
}
