import styled from 'styled-components/macro';

export const IconSpacer = styled.div<{
  spaceRight?: boolean;
  spaceLeft?: boolean;
}>`
  display: flex;
  align-items: center;
  ${({ spaceRight }) => (spaceRight ? 'margin-right: 0.25em' : null)};
  ${({ spaceLeft }) => spaceLeft && 'margin-left: 0.25em'};
`;
export const IconSpacerPointer = styled(IconSpacer)`
  cursor: pointer;
`;
