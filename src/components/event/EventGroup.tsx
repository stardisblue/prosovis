import React, { useMemo } from 'react';
import { map, reduce } from 'lodash';
import { useSelector } from 'react-redux';
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
import { EnlargeFlex, GrowFlexItem } from '../ui/Flex/styled-components';
import { IconSpacer } from '../ui/IconSpacer';
import { Note } from '../ui/Note';
import { EventLine } from './EventLine';
import { LeftSpacer } from './LeftSpacer';
import styled from 'styled-components/macro';
import {
  highlightable,
  HighlightableProp,
  maskable,
  MaskableProp,
  selectable,
  SelectableProp,
} from '../../feature/info/fold/styled-components';

export const EventGroup: React.FC<{
  kind: SiprojurisEvent['kind'];
  events: SelectedEvent<SiprojurisEvent>[];
  start: Datation;
  end: Datation;
  origin: SiprojurisActor['kind'] | SiprojurisNamedPlace['kind'];
  selected?: boolean;
  masked?: boolean;
}> = function ({ kind, events, start, end, origin, selected, masked }) {
  const interactive = useMemo(
    () => map(events, ({ id }) => ({ id, kind: 'Event' })),
    [events]
  );
  const handleHighLightHover = useHoverHighlight(interactive);

  const color = useSelector(selectSwitchKindColor);

  const Icon = getEventIcon(kind);

  /* Computed */
  const isHighlighted = useMemo(
    () => reduce(events, (acc, e) => acc || e.highlighted === true, false),
    [events]
  );
  const isMasked = useMemo(
    () => reduce(events, (acc, e) => acc && e.masked === true, true),
    [events]
  );
  const isSelected = useMemo(
    () => reduce(events, (acc, e) => acc || e.selected === true, false),
    [events]
  );

  return (
    <Note
      title={
        <InteractableEnlarge
          masked={isMasked}
          selected={isSelected}
          highlighted={isHighlighted}
          {...handleHighLightHover}
        >
          <IconSpacer>
            <Icon iconColor={color ? color(kind) : undefined} />
          </IconSpacer>
          <GrowFlexItem>
            {events.length} {getKindString(kind)}
          </GrowFlexItem>
          <EventDates dates={[start, end]} />
        </InteractableEnlarge>
      }
      underline
    >
      <LeftSpacer borderColor={color ? color(kind) : undefined}>
        {map(events, (e) => (
          <EventLine key={e.id} event={e} origin={origin} grouped />
        ))}
      </LeftSpacer>
    </Note>
  );
};

const InteractableEnlarge = styled(EnlargeFlex)<
  HighlightableProp & MaskableProp & SelectableProp
>`
  ${highlightable}
  ${maskable}
  ${selectable}
`;
