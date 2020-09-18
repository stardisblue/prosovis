import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { getEventLabel } from '../../data/getEventLabel';
import { SiprojurisEvent } from '../../data/sip-models';
import { ActorCard, AnyEvent, NamedPlace } from '../../data/models';
import getEventIcon from '../../data/getEventIcon';
import { EventDates } from '../DateComponent';
import {
  highlightable,
  HighlightableProp,
  maskable,
  MaskableProp,
  selectable,
  SelectableProp,
} from '../../feature/info/fold/styled-components';
import { SelectedEvent } from '../../feature/info/models';
import { useClickSelect } from '../../hooks/useClick';
import useHoverHighlight from '../../hooks/useHoverHighlight';
import { selectSwitchKindColor } from '../../selectors/switch';
import { IconSpacer } from '../ui/IconSpacer';

const Base = styled.div<SelectableProp & MaskableProp & HighlightableProp>`
  display: grid;
  grid-template-columns: auto 1fr auto;
  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 0.25em;
  padding-right: 0.25em;
  justify-content: space-between;
  align-items: center;
  ${selectable}
  ${maskable}
  ${highlightable};
`;

const EventLineIcon: React.FC<{ kind: AnyEvent['kind'] }> = function ({
  kind,
}) {
  const color = useSelector(selectSwitchKindColor);

  const Icon = getEventIcon(kind);

  return (
    <IconSpacer spaceRight>
      <Icon iconColor={color ? color(kind) : undefined} />
    </IconSpacer>
  );
};

export const EventLine: React.FC<{
  event: SelectedEvent<SiprojurisEvent>;
  origin: ActorCard['kind'] | NamedPlace['kind'];
  grouped?: boolean;
}> = function ({ event, origin, grouped = false }) {
  const dispatchable = { id: event.id, kind: 'Event' };
  const handleHighlightHover = useHoverHighlight(dispatchable);
  const handleSelectClick = useClickSelect(dispatchable);

  const showIcon = grouped ? <span /> : <EventLineIcon kind={event.kind} />;

  return (
    <Base
      {...handleHighlightHover}
      {...handleSelectClick}
      selected={event.selected === true}
      highlighted={event.highlighted === true}
      masked={event.masked === true}
    >
      {showIcon}
      <div>{getEventLabel(event, origin, grouped)}</div>
      <EventDates dates={event.datation} />
    </Base>
  );
};
