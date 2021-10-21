import { RootState } from '../reducers';
import { createSelector } from '@reduxjs/toolkit';
import { selectSelection } from './selection';
import { keyBy } from 'lodash/fp';
import { SelectionEvent } from '../reducers/selectionSlice';
import { SuperHightlightEvent } from '../reducers/superHighlightSlice';

export const selectSuperHighlight = (state: RootState) => state.superHighlight;

export const superHighlightAsMap = createSelector(
  selectSuperHighlight,
  keyBy<SuperHightlightEvent>('id')
);

export const selectSuperSelection = createSelector(
  selectSelection,
  selectSuperHighlight,
  (sel, superH) => {
    if (superH) return superH;
    else return sel;
  }
);

export const superSelectionAsMap = createSelector(
  selectSuperSelection,
  keyBy<SelectionEvent>('id')
);
