import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import getEventIcon from '../../data/getEventIcon';
import { getEventLabel } from '../../data/getEventLabel';
import {
  highlightable,
  HighlightableProp,
  maskable,
  MaskableProp,
  selectable,
  SelectableProp,
} from '../../feature/info/fold/styled-components';
import { useClickSelect } from '../../hooks/useClick';
import useHoverHighlight from '../../hooks/useHoverHighlight';
import { selectSwitchKindColor } from '../../selectors/switch';
import { ProsoVisDates } from '../../v2/components/ProsoVisDateComponent';
import {
  InformationGroup,
  Interactive,
} from '../../v2/detail/information/types';
import { ProsoVisDetailRichEvent, ProsoVisEvent } from '../../v2/types/events';
import { IconSpacer } from '../ui/IconSpacer';
import { EventErrors } from './EventErrors';

export const Base = styled.div<
  { grouped?: boolean } & SelectableProp & MaskableProp & HighlightableProp
>`
  display: grid;
  grid-template-columns: auto 2fr auto auto;
  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 0.25em;
  padding-right: 0.25em;
  justify-content: space-between;
  align-items: center;
  margin-right: ${({ grouped }) => (grouped ? '18px;' : '20px;')};
  ${selectable}
  ${maskable}
  ${highlightable};
`;

const EventLineIcon: React.FC<{ kind: ProsoVisEvent['kind'] }> = function ({
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
  event: Interactive<ProsoVisDetailRichEvent>;
  origin: InformationGroup['kind'];
  grouped?: boolean;
}> = function ({ event, origin, grouped = false }) {
  const dispatchable = { id: event.event.id, kind: 'Event' };
  const handleHighlightHover = useHoverHighlight(dispatchable);
  const handleSelectClick = useClickSelect(dispatchable);

  const showIcon = grouped ? (
    <span />
  ) : (
    <EventLineIcon kind={event.event.kind} />
  );

  const showErrors = useMemo(
    function () {
      return (
        event.errors !== undefined &&
        event.errors.length > 0 && (
          <EventErrors
            highlight={event.highlighted === true}
            errors={event.errors}
          />
        )
      );
    },
    [event.errors, event.highlighted]
  );

  return (
    <Base
      {...handleHighlightHover}
      {...handleSelectClick}
      selected={event.selected === true}
      highlighted={event.highlighted === true}
      masked={event.masked === true}
      grouped={grouped}
    >
      {showIcon}
      <div>{getEventLabel(event.event, origin, grouped)}</div>
      <ProsoVisDates dates={event.event.datation} />
      {showErrors}
    </Base>
  );
};
