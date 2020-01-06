import React, { useContext, useMemo } from 'react';
import _ from 'lodash';
import { Datation, AnyEvent, Ressource } from '../data';
import { SiprojurisContext } from '../context/SiprojurisContext';
import { SiprojurisInformationItem } from './SiprojurisInformationItem';

export function parseDates(dates: Datation[]) {
  return _(dates)
    .map(date => date.value)
    .join(' - ');
}

function useGroups(selectedEvents: AnyEvent[]) {
  // order by selection and then by kind
  return useMemo(() => {
    const grps: { key: Ressource; events: AnyEvent[] }[] = [];
    {
      const keyIndex: { [k: string]: number } = {};
      _.map(selectedEvents, e => {
        if (keyIndex[e.actor.id] === undefined) {
          keyIndex[e.actor.id] = grps.length;
          grps.push({ key: e.actor, events: [] });
        }

        grps[keyIndex[e.actor.id]].events.push(e);
      });
    }
    {
      const keyIndex: { [k: string]: number } = {};
      _.map(selectedEvents, (e: any) => {
        const localisation = e.localisation || {
          id: 0,
          label: 'Inconnu',
          kind: 'NamedPlace'
        };
        if (keyIndex[localisation.id] === undefined) {
          keyIndex[localisation.id] = grps.length;
          grps.push({ key: localisation, events: [] });
        }

        grps[keyIndex[localisation.id]].events.push(e);
      });
    }
    return grps;
  }, [selectedEvents]);
}

export const SiprojurisInformation: React.FC = function() {
  const siprojuris = useContext(SiprojurisContext);
  const { selected, events } = siprojuris;

  const selectedEvents = useMemo(
    () =>
      selected
        ? _(events)
            .map(e => {
              if (_.sortedIndexOf(selected, e.id) !== -1) {
                return { ...e, selected: true };
              }
              return e;
            })
            .orderBy(['selected', 'datation[0].clean_date'])
            .value()
        : events,
    [selected, events]
  );

  const groups = useGroups(selectedEvents);

  return (
    <div>
      {_.map(groups, ({ key, events }) => (
        <SiprojurisInformationItem
          key={key ? key.uri : 'undefined'}
          group={key}
          events={events}
        />
      ))}
    </div>
  );
};
