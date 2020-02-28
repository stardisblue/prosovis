import styled from 'styled-components';

export const StyledIcon = styled<any>('i')`
  background-color: ${props => props.background};
  border-color: ${props => props.border};
  height: 12px;
  width: 12px;
`;

export default StyledIcon;
