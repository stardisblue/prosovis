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
import { StyledFlex } from '../../components/ui/Flex/styled-components';
import styled from 'styled-components/macro';
import { IconSpacer } from '../../components/ui/IconSpacer';
import { scrollbar } from '../../components/scrollbar';
import { ProsoVisDate, ProsoVisEvent } from '../../v2/types/events';

type EventsByKind = {
  kind: string;
  events: ProsoVisEvent[];
};

type EventsByKindStartEndDate = EventsByKind & {
  datation: Datation[];
};

const eventsByFirstDate = sortBy<ProsoVisEvent>('datation[0].value');
const groupEventsByKind = (acc: EventsByKind[], curr: ProsoVisEvent) => {
  const prev = last(acc);
  if (prev?.kind === curr.kind) {
    prev.events.push(curr);
  } else {
    acc.push({ kind: curr.kind, events: [curr] });
  }
};
/**
 * @deprecated
 * TODO: Delete once Datation has been refactored
 */
function convertProsoVisDateToDatation(d: ProsoVisDate): Datation {
  return {
    id: d.id,
    label: d.kind as any,
    value: d.label,
    clean_date: d.value,
    uri: d.uri,
    url: '',
  };
}

const getDatationsFromEvents = flatMap((e: ProsoVisEvent) => e.datation);
const minDate = minBy<ProsoVisDate>('value');
const maxDate = maxBy<ProsoVisDate>('value');

const addStartEndDateToEventGroup = (v: EventsByKind) => {
  const datation = getDatationsFromEvents(v.events);
  const min = minDate(datation);
  const max = maxDate(datation);

  return {
    ...v,
    datation: compact(min === max ? [min] : [min, max]).map(
      convertProsoVisDateToDatation
    ),
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
  padding-right: 0.25em;
  padding-left: 0.25em;
  overflow-y: auto;

  ${scrollbar}
`;

export function DetailsMenuEvents({ events }: { events: ProsoVisEvent[] }) {
  const grouped = useMemo(() => {
    return pipe<
      [ProsoVisEvent[]],
      ProsoVisEvent[],
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
  kind: string;
  events: ProsoVisEvent[];
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
