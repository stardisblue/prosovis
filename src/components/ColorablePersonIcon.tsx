import { PersonIcon } from '@primer/octicons-react';
import styled from 'styled-components/macro';

export const ColorablePersonIcon = styled(PersonIcon)<{
  iconColor?: string;
}>(({ iconColor }) => (iconColor ? `color: ${iconColor};` : ''));
