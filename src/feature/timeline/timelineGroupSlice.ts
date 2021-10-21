import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../reducers';
import { selectMaskedEvents } from '../../selectors/mask';
import { ProsoVisActor } from '../../v2/types/actors';
import { ProsoVisDetailRichEvent, ProsoVisEvent } from '../../v2/types/events';
import { map, pipe, uniqBy } from 'lodash/fp';
import { unknownLocalisation } from '../../v2/detail/information/useGroups';
import { InformationGroup } from '../../v2/detail/information/types';

const timelineGroupSlice = createSlice({
  name: 'timelineGroup',
  initialState: 'Actor' as InformationGroup['kind'],
  reducers: {
    setGroup(_state, action: PayloadAction<InformationGroup['kind']>) {
      return action.payload;
    },
  },
});

export const { setGroup } = timelineGroupSlice.actions;

export default timelineGroupSlice.reducer;

export const selectTimelineGroup = (state: RootState) => state.timelineGroup;

export const selectTimelineEventGroups = createSelector(
  selectTimelineGroup,
  selectMaskedEvents,
  (grouping, events) => {
    switch (grouping) {
      case 'ActorNote':
        return pipe(
          uniqBy<ProsoVisDetailRichEvent>('actor.id'),
          map('actor'),
          map(
            ({ label, ...d }) =>
              ({ label: d.shortLabel, ...d } as ProsoVisActor)
          )
        )(events);
      case 'PlaceNote':
        return pipe(
          uniqBy<ProsoVisDetailRichEvent>((e) => e.localisation?.id ?? '-1'),
          map((e) => e.localisation ?? unknownLocalisation)
        )(events);
    }
  }
);

function groupByActor(e: ProsoVisEvent) {
  return e.actor;
}

function groupByPlace(e: ProsoVisEvent) {
  const loc = e.localisation;
  return loc ? loc : 0;
}

export const selectTimelineGroupBy = createSelector(
  selectTimelineGroup,
  (grouping) => {
    switch (grouping) {
      case 'ActorNote':
        return groupByActor;
      case 'PlaceNote':
        return groupByPlace;
    }
  }
);
