import { RootState } from '../reducers';
import { createSelector } from '@reduxjs/toolkit';
import _ from 'lodash';
import { PrimaryKey } from '../data/models';
import { SiprojurisEvent } from '../data/sip-models';

type HighlightEvent = { id: PrimaryKey; kind: string; type?: string };

export const selectHighlights = (state: RootState) => state.highlights;

export const highlightsAsMap = createSelector(selectHighlights, (res) =>
  _.keyBy(res, (i) => i.id)
);

export function isHighlighted(
  highlights: _.Dictionary<HighlightEvent>,
  event: SiprojurisEvent
) {
  return highlights[event.id] !== undefined;
}
