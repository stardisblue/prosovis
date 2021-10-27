import { createSelector } from 'reselect';
import {
  selectRelationSelection,
  selectSelectedGhosts,
} from '../selectionSlice';
import { selectRelationHighlights } from '../highlightSlice';
import { selectHighlightedGhosts } from '../highlightSlice';
import { sort } from 'd3';

export const selectIntersection = createSelector(
  selectRelationSelection,
  selectRelationHighlights,
  (sel, high) => {
    if (!sel) return null;
    return high && sel.actor === high.actor ? null : high;
  }
);

export const selectDisplayedRing = createSelector(
  selectSelectedGhosts,
  selectHighlightedGhosts,
  (sel, high) => (sel.ghosts.size > 0 ? sel : high)
);

export const selectDisplayedActorRingLinks = createSelector(
  selectDisplayedRing,
  ({ actorRingLinks }) => actorRingLinks
);
export const selectDisplayedRingLinks = createSelector(
  selectDisplayedRing,
  ({ ringLinks }) => ringLinks
);
export const selectDisplayedGhosts = createSelector(
  selectDisplayedRing,
  ({ ghosts }) => ghosts
);

export const selectSortedGhosts = createSelector(
  selectDisplayedGhosts,
  (ghosts) =>
    sort(
      ghosts.values(),
      (g) => g.order,
      (g) => g.weight
    )
);
