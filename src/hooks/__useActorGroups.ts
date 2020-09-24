import { useMemo } from 'react';
import _ from 'lodash';
import { DeprecatedAnyEvent, Ressource } from '../data/models';
/**
 *
 * @param selectedEvents
 * @deprecated
 */
export function useActorGroups(selectedEvents: DeprecatedAnyEvent[]) {
  return useMemo(() => {
    const byactor: {
      key: Ressource;
      events: DeprecatedAnyEvent[];
    }[] = [];
    const keyIndex: {
      [k: string]: number;
    } = {};
    _.map(selectedEvents, (e) => {
      if (keyIndex[e.actor.id] === undefined) {
        keyIndex[e.actor.id] = byactor.length;
        byactor.push({ key: e.actor, events: [] });
      }
      byactor[keyIndex[e.actor.id]].events.push(e);
    });
    return byactor;
  }, [selectedEvents]);
}
