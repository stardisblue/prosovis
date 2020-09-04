import { AnyEvent } from '../../../data/typings';
import {
  PlusIcon,
  MortarBoardIcon,
  BookIcon,
  BookmarkIcon,
  HomeIcon,
  Icon,
} from '@primer/octicons-react';
import Pause from './Pause';
import Grave from './Grave';

import styled from 'styled-components/macro';

export const styleIcon = (icon: Icon) =>
  styled(icon)<{
    iconColor?: string;
  }>(({ iconColor }) => (iconColor ? `color: ${iconColor};` : ''));
export const kindMap = {
  Birth: styleIcon(PlusIcon),
  Death: styleIcon(Grave),
  Education: styleIcon(BookIcon),
  ObtainQualification: styleIcon(MortarBoardIcon),
  PassageExamen: styleIcon(BookmarkIcon),
  Retirement: styleIcon(HomeIcon),
  SuspensionActivity: styleIcon(Pause),
};

function getEventIcon(kind: AnyEvent['kind']) {
  return kindMap[kind];
}

export default getEventIcon;
