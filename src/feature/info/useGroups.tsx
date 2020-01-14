import { useMemo } from 'react';
import _ from 'lodash';
import { AnyEvent, Ressource } from '../../data';
import { SelectedAnyEvent } from './models';

export function useGroups(selectedEvents: AnyEvent[]) {
  // order by selection and then by kind
  return useMemo(() => {
    const grps: {
      key: Ressource;
      events: SelectedAnyEvent[];
      selected: boolean;
    }[] = [];
    const actorKeyIndex: {
      [k: string]: number;
    } = {};
    const localisationKeyIndex: {
      [k: string]: number;
    } = {};
    _.map(selectedEvents, (e: any) => {
      if (actorKeyIndex[e.actor.id] === undefined) {
        actorKeyIndex[e.actor.id] = grps.length;
        grps.push({ key: e.actor, events: [], selected: false });
      }
      const localisation = e.localisation || {
        id: 0,
        label: 'Inconnue',
        kind: 'NamedPlace',
        uri: 'unknown'
      };
      if (localisationKeyIndex[localisation.id] === undefined) {
        localisationKeyIndex[localisation.id] = grps.length;
        grps.push({ key: localisation, events: [], selected: false });
      }
      if (e.selected === true) {
        grps[actorKeyIndex[e.actor.id]].selected = true;
        grps[localisationKeyIndex[localisation.id]].selected = true;
      }
      grps[actorKeyIndex[e.actor.id]].events.push(e);
      grps[localisationKeyIndex[localisation.id]].events.push(e);
    });
    return _.orderBy(grps, ['selected', 'key.kind', 'key.label'], ['desc']);
  }, [selectedEvents]);
}
