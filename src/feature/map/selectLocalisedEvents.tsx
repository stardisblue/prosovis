import { createSelector } from '@reduxjs/toolkit';
import _ from 'lodash';
import { selectMaskedEvents } from '../../selectors/mask';
import { getLocalisation } from '../../data';
import {
  NamedPlace,
  Actor,
  PrimaryKey,
  AnyEvent,
  Datation,
} from '../../data/models';

export const selectLocalisedEvents = createSelector(
  selectMaskedEvents,
  (events) =>
    _.transform(
      events,
      (acc, e) => {
        const l = getLocalisation(e);
        if (l !== null && l.lat && l.lng)
          acc.push({
            id: e.id,
            label: e.label,
            actor: e.actor.id,
            kind: e.kind,
            datation: e.datation,
            localisation: l,
          });
      },
      [] as {
        localisation: NamedPlace;
        label: string;
        actor: Actor['id'];
        id: PrimaryKey;
        kind: AnyEvent['kind'];
        datation: Datation[];
      }[]
    )
);
