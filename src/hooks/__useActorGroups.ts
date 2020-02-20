import { useMemo } from 'react';
import _ from 'lodash';
import { AnyEvent, Ressource } from '../data';
/**
 *
 * @param selectedEvents
 * @deprecated
 */
export function useActorGroups(selectedEvents: AnyEvent[]) {
  return useMemo(() => {
    const byactor: {
      key: Ressource;
      events: AnyEvent[];
    }[] = [];
    const keyIndex: {
      [k: string]: number;
    } = {};
    _.map(selectedEvents, e => {
      if (keyIndex[e.actor.id] === undefined) {
        keyIndex[e.actor.id] = byactor.length;
        byactor.push({ key: e.actor, events: [] });
      }
      byactor[keyIndex[e.actor.id]].events.push(e);
    });
    return byactor;
  }, [selectedEvents]);
}
