import Octicon from '@primer/octicons-react';
import styled from 'styled-components/macro';

export const StyledOcticon = styled(Octicon)<{
  iconColor?: string;
}>(({ iconColor }) => (iconColor ? `color: ${iconColor};` : ''));

export default StyledOcticon;
