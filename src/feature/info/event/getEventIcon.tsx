import { AnyEvent } from '../../../data';
import {
  Plus,
  MortarBoard,
  Book,
  Bookmark,
  Home,
} from '@primer/octicons-react';
import Pause from './Pause';
import Grave from './Grave';

export const kindMap = {
  Birth: Plus,
  Death: Grave,
  Education: Book,
  ObtainQualification: MortarBoard,
  PassageExamen: Bookmark,
  Retirement: Home,
  SuspensionActivity: Pause,
};

function getEventIcon(kind: AnyEvent['kind']) {
  return kindMap[kind];
}

export default getEventIcon;
