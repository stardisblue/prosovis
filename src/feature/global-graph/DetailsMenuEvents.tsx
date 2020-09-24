import React, { useMemo } from 'react';
import { Datation } from '../../data/models';
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
import { SiprojurisEvent } from '../../data/sip-models';

type EventsByKind = {
  kind: SiprojurisEvent['kind'];
  events: SiprojurisEvent[];
};

type EventsByKindStartEndDate = EventsByKind & {
  start: Datation | undefined;
  end: Datation | undefined;
};

const eventsByFirstDate = sortBy<SiprojurisEvent>('datation[0].clean_date');
const groupEventsByKind = (acc: EventsByKind[], curr: SiprojurisEvent) => {
  const prev = last(acc);
  if (prev?.kind === curr.kind) {
    prev.events.push(curr);
  } else {
    acc.push({ kind: curr.kind, events: [curr] });
  }
};

const getDatationsFromEvents = flatMap((e: SiprojurisEvent) => e.datation);
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

export function DetailsMenuEvents({ events }: { events: SiprojurisEvent[] }) {
  const grouped = useMemo(() => {
    return pipe<
      [SiprojurisEvent[]],
      SiprojurisEvent[],
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
  kind: SiprojurisEvent['kind'];
  events: SiprojurisEvent[];
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
