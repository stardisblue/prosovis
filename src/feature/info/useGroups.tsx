import { useMemo } from 'react';
import _ from 'lodash';
import { AnyEvent, Ressource } from '../../data';
import { SelectedAnyEvent } from './models';

export function useGroups(selectedEvents: AnyEvent[]) {
  // order by selection and then by kind
  return useMemo(() => {
    const grps: {
      kind: 'Actor' | 'NamedPlace';
      key: Ressource;
      events: SelectedAnyEvent[];
      selected: boolean;
      filtered: boolean;
    }[] = [];
    const actorKeyIndex: {
      [k: string]: number;
    } = {};
    const localisationKeyIndex: {
      [k: string]: number;
    } = {};
    _.map(selectedEvents, (e: SelectedAnyEvent) => {
      if (actorKeyIndex[e.actor.id] === undefined) {
        actorKeyIndex[e.actor.id] = grps.length;
        grps.push({
          kind: 'Actor',
          key: e.actor,
          events: [],
          selected: false,
          filtered: true
        });
      }
      const localisation = (e as any).localisation || {
        id: 0,
        label: 'Inconnue',
        kind: 'NamedPlace',
        uri: 'unknown'
      };
      if (localisationKeyIndex[localisation.id] === undefined) {
        localisationKeyIndex[localisation.id] = grps.length;
        grps.push({
          kind: 'NamedPlace',
          key: localisation,
          events: [],
          selected: false,
          filtered: true
        });
      }

      if (e.selected === true) {
        grps[actorKeyIndex[e.actor.id]].selected = true;
        grps[localisationKeyIndex[localisation.id]].selected = true;
      }

      if (e.filtered === false) {
        grps[actorKeyIndex[e.actor.id]].filtered = false;
        grps[localisationKeyIndex[localisation.id]].filtered = false;
      }

      grps[actorKeyIndex[e.actor.id]].events.push(e);
      grps[localisationKeyIndex[localisation.id]].events.push(e);
    });
    return _(grps)
      .orderBy(['selected', 'key.kind', 'key.label'], ['desc'])
      .groupBy(e => (e.filtered === true ? 'yes' : 'no'))
      .value();
  }, [selectedEvents]);
}
