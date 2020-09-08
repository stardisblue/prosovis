import styled from 'styled-components/macro';

export const IconSpacer = styled.div<{
  spaceRight?: boolean;
  spaceLeft?: boolean;
}>`
  display: flex;
  ${({ spaceRight }) => (spaceRight ? 'margin-right: 0.25em' : null)};
  ${({ spaceLeft }) => spaceLeft && 'margin-left: 0.25em'};
  flex-direction: column;
  justify-content: center;
`;
export const IconSpacerPointer = styled(IconSpacer)`
  cursor: pointer;
`;
