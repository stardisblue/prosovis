import {
  PlusIcon,
  MortarBoardIcon,
  BookIcon,
  BookmarkIcon,
  HomeIcon,
  Icon,
  IconProps,
} from '@primer/octicons-react';
import Pause from '../feature/info/event/Pause';
import Grave from '../feature/info/event/Grave';

import styled, { StyledComponent } from 'styled-components/macro';

export const styleIcon = (icon: Icon) =>
  styled(icon)<{
    iconColor?: string;
  }>(({ iconColor }) => (iconColor ? `color: ${iconColor};` : ''));
export const kindMap: _.Dictionary<
  StyledComponent<
    React.FC<IconProps>,
    any,
    {
      iconColor?: string | undefined;
    },
    never
  >
> = {
  Birth: styleIcon(PlusIcon),
  Death: styleIcon(Grave),
  Education: styleIcon(BookIcon),
  ObtainQualification: styleIcon(MortarBoardIcon),
  PassageExamen: styleIcon(BookmarkIcon),
  Retirement: styleIcon(HomeIcon),
  SuspensionActivity: styleIcon(Pause),
};

function getEventIcon(kind: string) {
  return kindMap[kind];
}

export default getEventIcon;
