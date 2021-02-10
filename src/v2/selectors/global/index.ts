import { isEmpty } from 'lodash/fp';
import { createSelector } from 'reselect';
import { selectGlobalHighlight } from './highlight';
import { selectGlobalSelection } from './selection';
import { createInteractionMap } from './utils';

export const selectInteractionMap = createSelector(
  selectGlobalHighlight,
  selectGlobalSelection,
  (hover, selec) => {
    const inter = hover.length !== 0 ? hover : selec;

    return createInteractionMap(inter);
  }
);

export const selectIsInteractionEmpty = createSelector(
  selectInteractionMap,
  (interactors) => isEmpty(interactors.events) && isEmpty(interactors.actors)
);
