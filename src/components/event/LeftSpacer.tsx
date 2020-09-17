import styled from 'styled-components/macro';
import { lightgray } from '../ui/colors';

export const LeftSpacer = styled('div')<{ borderColor?: string }>`
  border-color: ${({ borderColor = lightgray }) => borderColor};
  box-sizing: border-box;
  margin-left: 11px; /* 4px icon-spacing + 7px icon centering */
  padding-left: 3px;
  border-left-style: solid;
  border-width: 2px;
`;

export const LeftBottomSpacer = styled(LeftSpacer)`
  border-bottom-style: solid;
  padding-bottom: 2px;
  margin-bottom: 0.25em;
  overflow-y: auto;
  min-height: 2em;
`;
