import { AnyEvent } from '../../../data';
import {
  Plus,
  X,
  MortarBoard,
  Book,
  Bookmark,
  Home
} from '@primer/octicons-react';
import Pause from './Pause';

export const kindMap = {
  Birth: Plus,
  Death: X,
  Education: Book,
  ObtainQualification: MortarBoard,
  PassageExamen: Bookmark,
  Retirement: Home,
  SuspensionActivity: Pause
};

function getEventIcon(kind: AnyEvent['kind']) {
  return kindMap[kind];
}

export default getEventIcon;
