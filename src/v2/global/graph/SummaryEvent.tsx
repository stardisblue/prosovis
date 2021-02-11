import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { EventDates } from '../../../components/DateComponent';
import { StyledFlex } from '../../../components/ui/Flex/styled-components';
import { IconSpacer } from '../../../components/ui/IconSpacer';
import getEventIcon from '../../../data/getEventIcon';
import eventKind from '../../../i18n/event-kind';
import { selectSwitchKindColor } from '../../../selectors/switch';
import { ProsoVisDates } from '../../components/ProsoVisDateComponent';
import { ProsoVisDate } from '../../types/events';

export const SummaryEvent: React.FC<{
  kind: string;
  events: number;
  datation: ProsoVisDate[];
}> = function ({ kind, events, datation }) {
  const color = useSelector(selectSwitchKindColor);
  const Icon = getEventIcon(kind);
  return (
    <StyledEventLine>
      <span>{events}x</span>
      <IconSpacer spaceLeft spaceRight>
        <Icon iconColor={color ? color(kind) : 'black'} aria-label={kind} />
      </IconSpacer>
      <StyledSpan>{eventKind(kind)}</StyledSpan>
      {datation.length > 0 && <ProsoVisDates dates={datation} />}
    </StyledEventLine>
  );
};

const StyledEventLine = styled(StyledFlex)`
  align-items: center;
`;
const StyledSpan = styled.span`
  flex: 1;
`;
