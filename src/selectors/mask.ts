import { RootState } from '../reducers';
import { createSelector } from '@reduxjs/toolkit';
import { AnyEvent } from '../data';
import moment from 'moment';
import _ from 'lodash';
import { selectEvents } from './event';

export const selectIntervalMask = (state: RootState) => state.mask.interval;
export const selectKindMask = (state: RootState) => state.mask.kind;

export const selectIntervalFun = createSelector([selectIntervalMask], res =>
  res
    ? ({ datation }: AnyEvent) =>
        _.some(datation, ({ clean_date }) =>
          moment(clean_date).isBetween(res.start, res.end)
        )
    : undefined
);

export const selectKindFun = createSelector([selectKindMask], res =>
  res ? (e: AnyEvent) => res[e.kind] : undefined
);

export const maskAllFun = createSelector(
  [selectIntervalFun, selectKindFun],
  function(interval, kind) {
    return (e: AnyEvent) => {
      if (interval && !interval(e)) return false;
      if (kind && !kind(e)) return false;
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
