import { AnyEvent } from '../../../data';
import {
  Plus,
  X,
  MortarBoard,
  Book,
  Bookmark,
  Home,
  Telescope
} from '@primer/octicons-react';

export const kindMap = {
  Birth: Plus,
  Death: X,
  Education: Book,
  ObtainQualification: MortarBoard,
  PassageExamen: Bookmark,
  Retirement: Home,
  SuspensionActivity: Telescope
};

function getEventIcon(kind: AnyEvent['kind']) {
  return kindMap[kind];
}

export default getEventIcon;
