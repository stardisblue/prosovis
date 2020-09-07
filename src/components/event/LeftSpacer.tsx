import styled from 'styled-components/macro';
import { lightgray } from '../ui/colors';

export const LeftSpacer = styled('div')<{ borderColor?: string }>`
  border-color: ${({ borderColor = lightgray }) => borderColor};
  box-sizing: border-box;
  margin-left: 7px;
  padding-left: calc(7px + 0.25em);
  border-left-style: solid;
  border-width: 2px;
`;

export const LeftBottomSpacer = styled(LeftSpacer)`
  border-bottom-style: solid;
`;
