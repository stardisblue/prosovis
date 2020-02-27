import { RootState } from '../reducers';
import { createSelector } from '@reduxjs/toolkit';
import { AnyEvent, getLocalisation } from '../data';
import moment from 'moment';
import _ from 'lodash';
import { selectEvents } from './event';
import L from 'leaflet';

export const selectMask = (state: RootState) => state.mask;
export const selectIntervalMask = createSelector(
  selectMask,
  mask => mask.interval
);
export const selectKindMask = createSelector(selectMask, mask => mask.kind);
export const selectBoundsMask = createSelector(selectMask, mask => mask.bounds);

export const selectIntervalFun = createSelector(selectIntervalMask, res =>
  res
    ? ({ datation }: AnyEvent) =>
        _.some(datation, ({ clean_date }) =>
          moment(clean_date).isBetween(res.start, res.end)
        )
    : undefined
);

export const selectKindFun = createSelector(selectKindMask, res =>
  res ? (e: AnyEvent) => res[e.kind] : undefined
);

export const selectBoundsFun = createSelector(selectBoundsMask, res =>
  res
    ? (e: AnyEvent) => {
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
  selectBoundsFun,
  function(interval, kind, bound) {
    return (e: AnyEvent) => {
      if (interval && !interval(e)) return false;
      if (kind && !kind(e)) return false;
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

export const maskedEventsAsMap = createSelector(selectMaskedEvents, events =>
  _.keyBy(events, 'id')
);
