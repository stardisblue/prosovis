import { greatest, least } from 'd3';
import { first, isArray, last, reduce } from 'lodash/fp';
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

          lastEvent.start = least(
            [lastEvent.start, first(event.datation)],
            (d) => d?.value
          );
          lastEvent.end = greatest(
            [lastEvent.end, last(event.datation)],
            (d) => d?.value
          );

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
