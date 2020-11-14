import { filter } from 'lodash/fp';
import { createSelector } from 'reselect';
import { RootState } from '../../reducers';
import { selectAllEvents } from './events';

export const selectGlobalKindMask = (state: RootState) => state.globalKindMask;

export const selectAllMaskedEvents = createSelector(
  selectAllEvents,
  selectGlobalKindMask,
  (events, mask) =>
    filter(({ value: { kind } }) => mask[kind] === undefined, events)
);
