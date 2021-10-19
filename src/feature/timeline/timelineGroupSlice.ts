import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../reducers';
import { selectMaskedEvents } from '../../selectors/mask';
import { ProsoVisActor } from '../../v2/types/actors';
import { ProsoVisDetailRichEvent, ProsoVisEvent } from '../../v2/types/events';
import { ProsoVisPlace } from '../../v2/types/localisations';
import { map, pipe, uniqBy } from 'lodash/fp';

type TimelineGroupTypes = 'Actor' | 'NamedPlace';

const timelineGroupSlice = createSlice({
  name: 'timelineGroup',
  initialState: 'Actor' as TimelineGroupTypes,
  reducers: {
    setGroup(_state, action: PayloadAction<TimelineGroupTypes>) {
      return action.payload;
    },
  },
});

export const { setGroup } = timelineGroupSlice.actions;

export default timelineGroupSlice.reducer;

export const selectTimelineGroup = (state: RootState) => state.timelineGroup;

const defaultLocalisation: ProsoVisPlace = {
  id: '-1',
  label: 'Inconnue',
  kind: 'NamedPlace',
  uri: 'unknown',
  lat: null,
  lng: null,
};

export const selectTimelineEventGroups = createSelector(
  selectTimelineGroup,
  selectMaskedEvents,
  (grouping, events) => {
    switch (grouping) {
      case 'Actor':
        return pipe(
          uniqBy<ProsoVisDetailRichEvent>('actor.id'),
          map('actor'),
          map(
            ({ label, ...d }) =>
              ({ label: d.shortLabel, ...d } as ProsoVisActor)
          )
        )(events);
      case 'NamedPlace':
        return pipe(
          uniqBy<ProsoVisDetailRichEvent>((e) => e.localisation?.id ?? '-1'),
          map((e) => e.localisation ?? defaultLocalisation)
        )(events);
    }
  }
);

function groupByActor(e: ProsoVisEvent) {
  return e.actor;
}

function groupByNamedPlace(e: ProsoVisEvent) {
  const loc = e.localisation;
  return loc ? loc : 0;
}

export const selectTimelineGroupBy = createSelector(
  selectTimelineGroup,
  (grouping) => {
    switch (grouping) {
      case 'Actor':
        return groupByActor;
      case 'NamedPlace':
        return groupByNamedPlace;
    }
  }
);
