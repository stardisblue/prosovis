import styled from 'styled-components/macro';

export const IconSpacer = styled.div<{ spaceRight?: boolean }>`
  display: flex;
  ${({ spaceRight }) =>
    spaceRight === undefined || spaceRight ? 'margin-right: 0.25em' : ''};
  flex-direction: column;
  justify-content: center;
`;
export const IconSpacerPointer = styled(IconSpacer)`
  cursor: pointer;
`;
