import { every, some } from 'lodash/fp';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { getKindString } from '../../data/getEventLabel';
import {
  SiprojurisActor,
  SiprojurisEvent,
  SiprojurisNamedPlace,
} from '../../data/sip-models';
import { Datation } from '../../data/models';
import getEventIcon from '../../data/getEventIcon';
import {
  highlightable,
  HighlightableProp,
  maskable,
  MaskableProp,
  selectable,
  SelectableProp,
} from '../../feature/info/fold/styled-components';
import { SelectedEvent } from '../../feature/info/models';
import useHoverHighlight from '../../hooks/useHoverHighlight';
import { selectSwitchKindColor } from '../../selectors/switch';
import { EnlargeFlex, GrowFlexItem } from '../ui/Flex/styled-components';
import { IconSpacer } from '../ui/IconSpacer';
import { Note } from '../ui/Note';
import { EventLine } from './EventLine';
import { LeftSpacer } from './LeftSpacer';
import { EventDates } from '../DateComponent';

export const EventGroup: React.FC<{
  kind: SiprojurisEvent['kind'];
  events: SelectedEvent<SiprojurisEvent>[];
  start: Datation;
  end: Datation;
  origin: SiprojurisActor['kind'] | SiprojurisNamedPlace['kind'];
}> = function ({ kind, events, start, end, origin }) {
  const interactive = useMemo(
    () => events.map(({ id }) => ({ id, kind: 'Event' })),
    [events]
  );
  const handleHighLightHover = useHoverHighlight(interactive);

  const color = useSelector(selectSwitchKindColor);

  const Icon = getEventIcon(kind);

  /* Computed */
  const isHighlighted = useMemo(() => some(['highlighted', true], events), [
    events,
  ]);
  const isMasked = useMemo(() => every(['masked', true], events), [events]);
  const isSelected = useMemo(() => some(['selected', true], events), [events]);

  return (
    <Note
      title={
        <InteractableEnlarge
          masked={isMasked}
          selected={isSelected}
          highlighted={isHighlighted}
          {...handleHighLightHover}
        >
          <IconSpacer spaceRight>
            <Icon iconColor={color ? color(kind) : undefined} />
          </IconSpacer>
          <GrowFlexItem>
            {events.length} {getKindString(kind)}
          </GrowFlexItem>
          <EventDates dates={[start, end]} />
        </InteractableEnlarge>
      }
    >
      <LeftSpacer borderColor={color ? color(kind) : undefined}>
        {events.map((e) => (
          <EventLine key={e.id} event={e} origin={origin} grouped />
        ))}
      </LeftSpacer>
    </Note>
  );
};

const InteractableEnlarge = styled(EnlargeFlex)<
  HighlightableProp & MaskableProp & SelectableProp
>`
  padding-top: 1px;
  padding-bottom: 1px;
  padding-left: 0.25em;
  padding-right: 0.25em;
  ${highlightable}
  ${maskable}
  ${selectable}
`;
