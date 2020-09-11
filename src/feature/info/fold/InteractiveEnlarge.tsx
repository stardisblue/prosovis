import styled from 'styled-components/macro';
import { EnlargeFlex } from '../../../components/ui/Flex/styled-components';
import {
  highlightable,
  selectable,
  HighlightableProp,
  SelectableProp,
} from './styled-components';

export const InteractiveEnlarge = styled(EnlargeFlex)<
  HighlightableProp & SelectableProp
>`
  padding-top: 2px;
  padding-bottom: 2px;
  ${highlightable}
  ${selectable}
`;
