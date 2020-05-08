import { createSelector } from 'reselect';
import { selectRelationSelection } from '../selectionSlice';
import { selectRelationHighlights } from '../highlightSlice';

export const selectIntersection = createSelector(
  selectRelationSelection,
  selectRelationHighlights,
  (sel, high) => {
    if (!sel) return null;
    return high && sel.actor === high.actor ? null : high;
  }
);
