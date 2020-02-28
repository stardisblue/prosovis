import React from 'react';
import Octicon, { OcticonProps } from '@primer/octicons-react';
import styled from 'styled-components';

export const StyledOcticon = styled<
  React.FC<
    OcticonProps & {
      color: string;
    }
  >
>(Octicon)`
  color: ${props => props.color};
`;

export default StyledOcticon;
