import { useMemo } from 'react';
import { getLocalisation } from '../../data';
import { SelectedEvent } from './models';
import { orderBy, groupBy, map, pipe, sortBy } from 'lodash/fp';
import {
  SiprojurisActor,
  SiprojurisEvent,
  SiprojurisNamedPlace,
} from '../../data/sip-models';

export function useGroups(selectedEvents: SelectedEvent<SiprojurisEvent>[]) {
  // order by selection and then by kind
  return useMemo(() => {
    const grps: SelectedEventsGroupObject[] = [];
    const actorKeyIndex: {
      [k: string]: number;
    } = {};
    const localisationKeyIndex: {
      [k: string]: number;
    } = {};
    map((e) => {
      if (actorKeyIndex[e.actor.id] === undefined) {
        actorKeyIndex[e.actor.id] = grps.length;
        grps.push({
          kind: 'Actor',
          group: e.actor,
          events: [],
          highlighted: false,
          selected: false,
          masked: true,
        });
      }
      const localisation = getLocalisation(e) || {
        id: -1,
        label: 'Inconnue',
        kind: 'NamedPlace',
        uri: 'unknown',
        url: 'unknown',
        lat: null,
        lng: null,
      };
      if (localisationKeyIndex[localisation.id] === undefined) {
        localisationKeyIndex[localisation.id] = grps.length;
        grps.push({
          kind: 'NamedPlace',
          group: localisation,
          events: [],
          highlighted: false,
          selected: false,
          masked: true,
        });
      }

      if (e.selected === true) {
        grps[actorKeyIndex[e.actor.id]].selected = true;
        grps[localisationKeyIndex[localisation.id]].selected = true;
      }

      if (e.highlighted === true) {
        grps[actorKeyIndex[e.actor.id]].highlighted = true;
        grps[localisationKeyIndex[localisation.id]].highlighted = true;
      }

      if (e.masked === false) {
        grps[actorKeyIndex[e.actor.id]].masked = false;
        grps[localisationKeyIndex[localisation.id]].masked = false;
      }

      grps[actorKeyIndex[e.actor.id]].events.push(e);
      grps[localisationKeyIndex[localisation.id]].events.push(e);
    }, selectedEvents);

    return pipe(
      orderBy<SelectedEventsGroupObject>(
        ['selected', 'group.kind', 'events[0].datation[0].clean_date'],
        ['desc']
      ),
      sortBy((e: SelectedEventsGroupObject) =>
        e.group.label === 'Inconnue' ? 1 : 0
      ),
      groupBy<SelectedEventsGroupObject>((e) =>
        e.masked === true ? 'yes' : 'no'
      )
    )(grps);
  }, [selectedEvents]);
}

type SelectedEventsGroupObject =
  | SelectedEventsGroup<SiprojurisActor>
  | SelectedEventsGroup<SiprojurisNamedPlace>;

type SelectedEventsGroup<T extends SiprojurisActor | SiprojurisNamedPlace> = {
  kind: T['kind'];
  group: T;
  events: SelectedEvent<SiprojurisEvent>[];
  selected: boolean;
  highlighted: boolean;
  masked: boolean;
};
