import { useMemo } from 'react';
import _ from 'lodash';
import { DeprecatedAnyEvent, Ressource } from '../data/models';
/**
 *
 * @param selectedEvents
 * @deprecated
 */
export function usePlaceGroups(selectedEvents: DeprecatedAnyEvent[]) {
  return useMemo(() => {
    const places: { key: Ressource; events: DeprecatedAnyEvent[] }[] = [];
    const keyIndex: { [k: string]: number } = {};
    _.map(selectedEvents, (e: any) => {
      if (keyIndex[e.localisation?.id] === undefined) {
        keyIndex[e.localisation?.id] = places.length;
        places.push({ key: e.localisation, events: [] });
      }

      places[keyIndex[e.localisation?.id]].events.push(e);
    });

    return places;
  }, [selectedEvents]);
}
