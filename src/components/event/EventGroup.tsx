import React, { useMemo } from 'react';
import { map } from 'lodash';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { getKindString } from '../../data/getEventLabel';
import {
  SiprojurisActor,
  SiprojurisEvent,
  SiprojurisNamedPlace,
} from '../../data/sip-typings';
import { Datation } from '../../data/typings';
import getEventIcon from '../../feature/info/event/getEventIcon';
import { EventDates } from '../../feature/info/EventDates';
import { SelectedEvent } from '../../feature/info/models';
import useHoverHighlight from '../../hooks/useHoverHighlight';
import { selectSwitchKindColor } from '../../selectors/switch';
import { GrowFlexItem } from '../ui/Flex/styled-components';
import { IconSpacer } from '../ui/IconSpacer';
import { Note } from '../ui/Note';
import { EventLine } from './EventLine';

const MarginLeftDiv = styled('div')<{ borderColor?: string }>`
  border-color: ${({ borderColor = 'grey' }) => borderColor};
  margin-left: 1rem;
`;

export const EventGroup: React.FC<{
  kind: SiprojurisEvent['kind'];
  events: SelectedEvent<SiprojurisEvent>[];
  start: Datation;
  end: Datation;
  origin: SiprojurisActor['kind'] | SiprojurisNamedPlace['kind'];
}> = function ({ kind, events, start, end, origin }) {
  const interactive = useMemo(
    () => map(events, ({ id }) => ({ id, kind: 'Event' })),
    [events]
  );
  const handleHighLightHover = useHoverHighlight(interactive);

  const color = useSelector(selectSwitchKindColor);

  const Icon = getEventIcon(kind);

  return (
    <Note
      title={
        <>
          <IconSpacer>
            <Icon iconColor={color ? color(kind) : undefined} />
          </IconSpacer>
          <GrowFlexItem>
            {events.length} {getKindString(kind)}
          </GrowFlexItem>
          <EventDates dates={[start, end]} />
        </>
      }
      {...handleHighLightHover}
    >
      <MarginLeftDiv borderColor={color ? color(kind) : undefined}>
        {map(events, (e) => (
          <EventLine key={e.id} event={e} origin={origin} grouped />
        ))}
      </MarginLeftDiv>
    </Note>
  );
};
