import { pickBy } from 'lodash/fp';
import { createSelector } from 'reselect';
import { selectEvents } from '../events';
import { selectActiveKinds } from './kind';

export const selectEventsWithoutKinds = createSelector(
  selectEvents,
  selectActiveKinds,
  (events, kinds) => pickBy(({ kind }) => kinds[kind] === undefined, events)
);
