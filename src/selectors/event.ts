import { RootState } from '../reducers';
import { createSelector } from '@reduxjs/toolkit';
import _ from 'lodash';
import { getLocalisation } from '../data';
import { SiprojurisNamedPlace } from '../data/sip-models';

export const selectEvents = (state: RootState) => state.events;

export const selectEventsAsMap = createSelector(selectEvents, (events) =>
  _.keyBy(events, 'id')
);

export const selectKinds = createSelector(selectEvents, (events) =>
  _(events).uniqBy('kind').map('kind').keyBy().value()
);

export const selectActors = createSelector(selectEvents, (events) =>
  _(events).uniqBy('actor.id').map('actor').keyBy('id').value()
);

const defaultPlace: SiprojurisNamedPlace = {
  id: 0,
  label: 'Inconnu',
  kind: 'NamedPlace',
  uri: 'unknown',
  url: 'unknown',
  lat: null,
  lng: null,
};

export const selectPlaces = createSelector(selectEvents, (events) =>
  _(events)
    .uniqBy((s) => getLocalisation(s)?.id || -1)
    .map((s) => getLocalisation(s) || defaultPlace)
    .keyBy('id')
    .value()
);
