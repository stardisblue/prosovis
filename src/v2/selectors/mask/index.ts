import { filter } from 'lodash/fp';
import { createSelector } from 'reselect';
import { selectAllEvents } from '../events';
import { selectMaskKind } from './kind';

export const selectAllMaskedEvents = createSelector(
  selectAllEvents,
  selectMaskKind,
  (events, mask) =>
    filter(({ value: { kind } }) => mask[kind] === undefined, events)
);
