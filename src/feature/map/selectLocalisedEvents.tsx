import { createSelector } from '@reduxjs/toolkit';
import _ from 'lodash';
import { selectMaskedEvents } from '../../selectors/mask';
import { getLocalisation } from '../../data';
import { PrimaryKey, Datation } from '../../data/models';
import {
  SiprojurisActor,
  SiprojurisEvent,
  SiprojurisNamedPlace,
} from '../../data/sip-models';

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
        localisation: SiprojurisNamedPlace;
        label: string;
        actor: SiprojurisActor['id'];
        id: PrimaryKey;
        kind: SiprojurisEvent['kind'];
        datation: Datation[];
      }[]
    )
);
