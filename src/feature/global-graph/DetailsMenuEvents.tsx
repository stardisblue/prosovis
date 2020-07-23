import React, { useMemo } from 'react';
import { AnyEvent, Datation } from '../../data';
import _ from 'lodash';
import getEventIcon from '../info/event/getEventIcon';
import { useSelector } from 'react-redux';
import { selectSwitchKindColor } from '../../selectors/switch';
import { EventDates } from '../info/EventDates';
import eventKind from '../../i18n/event-kind';
export function DetailsMenuEvents({ events }: { events: AnyEvent[] }) {
  const grouped = useMemo(() => {
    return _(events)
      .sortBy('datation[0].clean_date')
      .transform((acc, curr) => {
        const prev = _.last(acc);
        if (prev?.kind === curr.kind) {
          prev.events.push(curr);
        } else {
          acc.push({ kind: curr.kind, events: [curr] });
        }
      }, [] as { kind: AnyEvent['kind']; events: AnyEvent[] }[])
      .map((v) => {
        const datation = _.flatMap(v.events, (e) => e.datation);
        return {
          ...v,
          start: _.minBy(datation, 'clean_date'),
          end: _.maxBy(datation, 'clean_date'),
        };
      })
      .value();
  }, [events]);

  return (
    <div>
      {_.map(grouped, ({ kind, events, start, end }) => (
        <DetailsMenuEvent
          key={events[0].id}
          kind={kind}
          events={events}
          start={start}
          end={end}
        />
      ))}
    </div>
  );
}
function DetailsMenuEvent({
  kind,
  events,
  start,
  end,
}: {
  kind: AnyEvent['kind'];
  events: AnyEvent[];
  start?: Datation;
  end?: Datation;
}) {
  const color = useSelector(selectSwitchKindColor);
  const Icon = getEventIcon(kind);
  return (
    <div>
      {events.length}x{' '}
      <Icon iconColor={color ? color(kind) : 'black'} aria-label={kind} />{' '}
      {eventKind(kind)}
      {start && end && (
        <EventDates dates={start === end ? [start] : [start, end]} />
      )}
    </div>
  );
}
