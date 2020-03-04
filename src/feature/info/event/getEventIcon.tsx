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

function getEventIcon(kind: AnyEvent['kind']) {
  switch (kind) {
    case 'Birth':
      return Plus;
    case 'Death':
      return X;
    case 'Education':
      return Book;
    case 'ObtainQualification':
      return MortarBoard;
    case 'PassageExamen':
      return Bookmark;
    case 'Retirement':
      return Home;
    case 'SuspensionActivity':
      return Telescope;
  }
}

export default getEventIcon;
