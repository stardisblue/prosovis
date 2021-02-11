import {
  compact,
  flatMap,
  last,
  map,
  maxBy,
  minBy,
  pipe,
  sortBy,
  transform,
} from 'lodash/fp';
import React, { useMemo } from 'react';
import styled from 'styled-components/macro';
import { scrollbar } from '../../../components/scrollbar';
import { ProsoVisDate, ProsoVisEvent } from '../../types/events';
import { SummaryEvent } from './SummaryEvent';

type EventsByKind = {
  kind: string;
  events: ProsoVisEvent[];
};
type EventsByKindStartEndDate = EventsByKind & {
  datation: ProsoVisDate[];
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

const minDate = minBy<ProsoVisDate>('value');
const maxDate = maxBy<ProsoVisDate>('value');

const addStartEndDateToEventGroup = (v: EventsByKind) => {
  const datation = flatMap('datation', v.events);
  const min = minDate(datation);
  const max = maxDate(datation);

  return {
    ...v,
    datation: compact(min === max ? [min] : [min, max]),
  };
};

const Base2 = styled.div`
  height: 100%;
  width: 100%;
  padding-right: 0.25em;
  padding-left: 0.25em;
  overflow-y: auto;

  ${scrollbar}
`;

export const SummaryEvents: React.FC<{ events: ProsoVisEvent[] }> = function ({
  events,
}) {
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
      map(({ kind, events, datation }: EventsByKindStartEndDate) => (
        <SummaryEvent
          key={events[0].id}
          kind={kind}
          events={events.length}
          datation={datation}
        />
      ))
    )(events);
  }, [events]);

  return <Base2>{grouped}</Base2>;
};
