import { RootState } from '../../reducers';
import { createSelector } from '@reduxjs/toolkit';
import {
  flatMap,
  identity,
  keyBy,
  map,
  pipe,
  sortBy,
  uniqBy,
  values,
} from 'lodash/fp';
import { ProsoVisEvent } from '../types/events';

export const selectEventsData = (state: RootState) => state.eventData;

export const selectEventIndex = createSelector(
  selectEventsData,
  (events) => events.events?.index
);

export const selectEvents = createSelector(
  selectEventIndex,
  (events) =>
    events &&
    pipe<[any], ProsoVisEvent[], _.Dictionary<ProsoVisEvent>>(
      flatMap(identity as (v: ProsoVisEvent[]) => ProsoVisEvent[]),
      keyBy<ProsoVisEvent>('id')
    )(events)
);

export const selectUniqueKinds = createSelector(
  selectEvents,
  (events) =>
    events &&
    pipe<
      [_.Dictionary<ProsoVisEvent>],
      ProsoVisEvent[],
      ProsoVisEvent[],
      string[],
      string[],
      _.Dictionary<string>
    >(
      values,
      uniqBy<ProsoVisEvent>('kind'),
      map('kind'),
      sortBy(identity),
      keyBy(identity)
    )(events)
);
