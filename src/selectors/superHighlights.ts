import { RootState } from '../reducers';
import { createSelector } from '@reduxjs/toolkit';
import _ from 'lodash';
import { PrimaryKey, AnyEvent } from '../data/models';
import { selectSelection } from './selection';

type SuperHighlight = { id: PrimaryKey; kind: string; type?: string };

export const selectSuperHighlight = (state: RootState) => state.superHighlight;

export const superHighlightAsMap = createSelector(selectSuperHighlight, (sel) =>
  _.keyBy(sel, 'id')
);

export const selectSuperSelection = createSelector(
  selectSelection,
  selectSuperHighlight,
  (sel, superH) => {
    if (superH) return superH;
    else return sel;
  }
);

export const superSelectionAsMap = createSelector(selectSuperSelection, (sel) =>
  _.keyBy(sel, 'id')
);

export function isSuperSelected(
  selections: _.Dictionary<SuperHighlight>,
  event: AnyEvent
) {
  return selections[event.id] !== undefined;
}
