import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { getEventLabel } from '../../data/getEventLabel';
import { SiprojurisEvent } from '../../data/sip-typings';
import { ActorCard, AnyEvent, NamedPlace } from '../../data/typings';
import getEventIcon from '../../feature/info/event/getEventIcon';
import { EventDates } from '../../feature/info/EventDates';
import { SelectedEvent } from '../../feature/info/models';
import { useClickSelect } from '../../hooks/useClick';
import useHoverHighlight from '../../hooks/useHoverHighlight';
import { selectSwitchKindColor } from '../../selectors/switch';
import { GrowFlexItem, StyledFlex } from '../ui/Flex/styled-components';
import { IconSpacer } from '../ui/IconSpacer';

const Base = styled(StyledFlex)<{
  selected?: boolean;
  masked?: boolean;
  highlighted?: boolean;
}>`
  justify-content: space-between;
  align-items: center;
  ${({ selected }) => selected && 'font-weight: 700;'}
  ${({ masked }) => masked && 'opacity: .5;'}
  ${({ highlighted }) =>
    highlighted && 'background-color:var(--light-gray);'};
`;

export const EventLine: React.FC<{
  event: SelectedEvent<SiprojurisEvent>;
  origin: ActorCard['kind'] | NamedPlace['kind'];
  grouped?: boolean;
}> = function ({ event, origin, grouped = false }) {
  const dispatchable = { id: event.id, kind: 'Event' };
  const handleHighlightHover = useHoverHighlight(dispatchable);
  const handleSelectClick = useClickSelect(dispatchable);

  const showIcon = !grouped && <EventLineIcon kind={event.kind} />;

  return (
    <Base {...handleHighlightHover} {...handleSelectClick}>
      {showIcon}
      <GrowFlexItem>{getEventLabel(event, origin, grouped)}</GrowFlexItem>
      <EventDates dates={event.datation} />
    </Base>
  );
};

const EventLineIcon: React.FC<{ kind: AnyEvent['kind'] }> = function ({
  kind,
}) {
  const color = useSelector(selectSwitchKindColor);

  const Icon = getEventIcon(kind);

  return (
    <IconSpacer>
      <Icon iconColor={color ? color(kind) : undefined} />
    </IconSpacer>
  );
};
