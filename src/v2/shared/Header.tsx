import React from 'react';
import styled from 'styled-components/macro';
import { HelpInfoBubble } from '../../feature/help/InfoButton';
import Mask from '../../feature/mask/Mask';
import { lightgray } from '../components/theme';
import { MoreFilters } from './filters/MoreFilters';

const StyledHeader = styled.div`
  display: grid;
  justify-content: center;
  grid-template-columns: auto 1fr auto;
  border-bottom: 1px solid ${lightgray};
`;

const StyledInfoBubble = styled(HelpInfoBubble)`
  padding: 2px;
`;

export const Header: React.FC = function () {
  return (
    <StyledHeader>
      <Mask />
      <MoreFilters />
      <StyledInfoBubble />
    </StyledHeader>
  );
};
