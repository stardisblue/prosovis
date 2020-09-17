import React, { useMemo } from 'react';
import { AnyEvent, Datation } from '../../data/models';
import {
  pipe,
  sortBy,
  transform,
  map,
  last,
  minBy,
  maxBy,
  flatMap,
} from 'lodash/fp';
import getEventIcon from '../../data/getEventIcon';
import { useSelector } from 'react-redux';
import { selectSwitchKindColor } from '../../selectors/switch';
import eventKind from '../../i18n/event-kind';
import { EventDates } from '../../components/DateComponent';

type EventsByKind = {
  kind: AnyEvent['kind'];
  events: AnyEvent[];
};

type EventsByKindStartEndDate = EventsByKind & {
  start: Datation | undefined;
  end: Datation | undefined;
};

const eventsByFirstDate = sortBy<AnyEvent>('datation[0].clean_date');
const groupEventsByKind = (acc: EventsByKind[], curr: AnyEvent) => {
  const prev = last(acc);
  if (prev?.kind === curr.kind) {
    prev.events.push(curr);
  } else {
    acc.push({ kind: curr.kind, events: [curr] });
  }
};

const getDatationsFromEvents = flatMap((e: AnyEvent) => e.datation);
const minDate = minBy<Datation>('clean_date');
const maxDate = maxBy<Datation>('clean_date');

const addStartEndDateToEventGroup = (v: EventsByKind) => {
  const datation = getDatationsFromEvents(v.events);
  return {
    ...v,
    start: minDate(datation),
    end: maxDate(datation),
  };
};

const createDetailsMenuEvent = ({
  kind,
  events,
  start,
  end,
}: EventsByKindStartEndDate) => (
  <DetailsMenuEvent
    key={events[0].id}
    kind={kind}
    events={events}
    start={start}
    end={end}
  />
);

export function DetailsMenuEvents({ events }: { events: AnyEvent[] }) {
  const grouped = useMemo(() => {
    return pipe<
      [AnyEvent[]],
      AnyEvent[],
      EventsByKind[],
      EventsByKindStartEndDate[],
      JSX.Element[]
    >(
      eventsByFirstDate,
      transform(groupEventsByKind, []),
      map(addStartEndDateToEventGroup),
      map(createDetailsMenuEvent)
    )(events);
  }, [events]);

  return <div>{grouped}</div>;
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
