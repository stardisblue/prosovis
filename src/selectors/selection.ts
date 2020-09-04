import { RootState } from '../reducers';
import { createSelector } from '@reduxjs/toolkit';
import _ from 'lodash';
import { PrimaryKey, AnyEvent } from '../data/typings';

type SelectionEvent = { id: PrimaryKey; kind: string; type?: string };

export const selectSelection = (state: RootState) => state.selection;

export const selectionAsMap = createSelector(selectSelection, (sel) =>
  _.keyBy(sel, 'id')
);

export function isSelected(
  selections: _.Dictionary<SelectionEvent>,
  event: AnyEvent
) {
  return selections[event.id] !== undefined;
}
