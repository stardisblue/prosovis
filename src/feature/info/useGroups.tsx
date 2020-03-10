import { useMemo } from 'react';
import _ from 'lodash';
import { Ressource, getLocalisation, NamedPlace } from '../../data';
import { SelectedEvent } from './models';

export function useGroups(selectedEvents: SelectedEvent[]) {
  // order by selection and then by kind
  return useMemo(() => {
    const grps: {
      kind: 'Actor' | 'NamedPlace';
      group: Ressource | NamedPlace;
      events: SelectedEvent[];
      selected: boolean;
      highlighted: boolean;
      masked: boolean;
    }[] = [];
    const actorKeyIndex: {
      [k: string]: number;
    } = {};
    const localisationKeyIndex: {
      [k: string]: number;
    } = {};
    _.map(selectedEvents, e => {
      if (actorKeyIndex[e.actor.id] === undefined) {
        actorKeyIndex[e.actor.id] = grps.length;
        grps.push({
          kind: 'Actor',
          group: e.actor,
          events: [],
          highlighted: false,
          selected: false,
          masked: true
        });
      }
      const localisation = getLocalisation(e) || {
        id: -1,
        label: 'Inconnue',
        kind: 'NamedPlace',
        uri: 'unknown',
        url: 'unknown'
      };
      if (localisationKeyIndex[localisation.id] === undefined) {
        localisationKeyIndex[localisation.id] = grps.length;
        grps.push({
          kind: 'NamedPlace',
          group: localisation,
          events: [],
          highlighted: false,
          selected: false,
          masked: true
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
    });
    return _(grps)
      .orderBy(
        ['selected', 'group.kind', 'events[0].datation[0].clean_date'],
        ['desc']
      )
      .groupBy(e => (e.masked === true ? 'yes' : 'no'))
      .value();
  }, [selectedEvents]);
}
