import { RootState } from '../reducers';
import { createSelector } from '@reduxjs/toolkit';
import _ from 'lodash';
import { selectSelection } from './selection';

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
