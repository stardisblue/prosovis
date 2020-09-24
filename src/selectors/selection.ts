import { RootState } from '../reducers';
import { createSelector } from '@reduxjs/toolkit';
import _ from 'lodash';
import { PrimaryKey } from '../data/models';
import { SiprojurisEvent } from '../data/sip-models';

type SelectionEvent = { id: PrimaryKey; kind: string; type?: string };

export const selectSelection = (state: RootState) => state.selection;

export const selectionAsMap = createSelector(selectSelection, (sel) =>
  _.keyBy(sel, 'id')
);

export function isSelected(
  selections: _.Dictionary<SelectionEvent>,
  event: SiprojurisEvent
) {
  return selections[event.id] !== undefined;
}
