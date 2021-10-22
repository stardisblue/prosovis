import { first, isArray, last, maxBy, minBy, reduce } from 'lodash/fp';
import { useMemo } from 'react';
import {
  EventGroup as EventGroupType,
  Interactive,
} from '../../../v2/detail/information/types';
import { ProsoVisDetailRichEvent } from '../../../v2/types/events';

export const useGroupEvents = function (
  events: Interactive<ProsoVisDetailRichEvent>[]
) {
  return useMemo(
    () =>
      reduce(
        (acc, e) => {
          const { event } = e;
          let lastEvent = last(acc);

          if (lastEvent === undefined || lastEvent.kind !== event.kind) {
            acc.push({
              id: event.id,
              kind: event.kind,
              events: e,
              start: first(event.datation),
              end: last(event.datation),
              masked: e.masked,
              selected: e.selected,
              highlighted: e.highlighted,
            });
            return acc;
          }
          if (isArray(lastEvent.events)) {
            lastEvent.events.push(e);
          } else {
            lastEvent.events = [lastEvent.events, e];
          }

          lastEvent.start = minBy('value', [
            lastEvent.start,
            first(event.datation),
          ]);
          lastEvent.end = maxBy('value', [lastEvent.end, last(event.datation)]);

          return acc;
        },
        [] as EventGroupType<
          | Interactive<ProsoVisDetailRichEvent>[]
          | Interactive<ProsoVisDetailRichEvent>
        >[],
        events
      ),
    [events]
  );
};
