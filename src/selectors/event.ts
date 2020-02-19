import { RootState } from '../reducers';
import { createSelector } from '@reduxjs/toolkit';
import _ from 'lodash';

export const selectEvents = (state: RootState) => state.events;

export const selectKinds = createSelector(selectEvents, events =>
  _(events)
    .uniqBy('kind')
    .map('kind')
    .value()
);
