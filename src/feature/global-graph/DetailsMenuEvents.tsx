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
  compact,
} from 'lodash/fp';
import getEventIcon from '../../data/getEventIcon';
import { useSelector } from 'react-redux';
import { selectSwitchKindColor } from '../../selectors/switch';
import eventKind from '../../i18n/event-kind';
import { EventDates } from '../../components/DateComponent';
import { SiprojurisEvent } from '../../data/sip-models';
import { StyledFlex } from '../../components/ui/Flex/styled-components';
import styled from 'styled-components/macro';
import { IconSpacer } from '../../components/ui/IconSpacer';

type EventsByKind = {
  kind: SiprojurisEvent['kind'];
  events: SiprojurisEvent[];
};

type EventsByKindStartEndDate = EventsByKind & {
  datation: Datation[];
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
  const min = minDate(datation);
  const max = maxDate(datation);

  return {
    ...v,
    datation: compact(min === max ? [min] : [min, max]),
  };
};

const createDetailsMenuEvent = ({
  kind,
  events,
  datation,
}: EventsByKindStartEndDate) => (
  <DetailsMenuEvent
    key={events[0].id}
    kind={kind}
    events={events}
    datation={datation}
  />
);

const Base = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: auto;
  padding-right: 1em;
  padding-left: 0.25em;
`;

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

  return <Base>{grouped}</Base>;
}

function DetailsMenuEvent({
  kind,
  events,
  datation,
}: {
  kind: SiprojurisEvent['kind'];
  events: SiprojurisEvent[];
  datation: Datation[];
}) {
  const color = useSelector(selectSwitchKindColor);
  const Icon = getEventIcon(kind);
  return (
    <StyledEventLine>
      <span>{events.length}x</span>
      <IconSpacer spaceLeft spaceRight>
        <Icon iconColor={color ? color(kind) : 'black'} aria-label={kind} />
      </IconSpacer>
      <StyledSpan>{eventKind(kind)}</StyledSpan>
      {datation.length > 0 && <EventDates dates={datation} />}
    </StyledEventLine>
  );
}
const StyledEventLine = styled(StyledFlex)`
  align-items: center;
`;

const StyledSpan = styled.span`
  flex: 1;
`;
