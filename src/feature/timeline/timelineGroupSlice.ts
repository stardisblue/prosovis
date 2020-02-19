import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../reducers';
import { AnyEvent, getLocalisation } from '../../data';
import _ from 'lodash';
import { selectMaskedEvents } from '../../selectors/mask';

type TimelineGroupTypes = 'Actor' | 'NamedPlace';

const timelineGroupSlice = createSlice({
  name: 'timelineGroup',
  initialState: 'Actor' as TimelineGroupTypes,
  reducers: {
    setGroup(_state, action: PayloadAction<TimelineGroupTypes>) {
      return action.payload;
    }
  }
});

export const { setGroup } = timelineGroupSlice.actions;

export default timelineGroupSlice.reducer;

export const selectTimelineGroup = (state: RootState) => state.timelineGroup;

const defaultLocalisation = {
  id: 0,
  label: 'Inconnue',
  kind: 'NamedPlace',
  url: 'unknown',
  uri: 'unknown'
};

export const selectTimelineEventGroups = createSelector(
  selectTimelineGroup,
  selectMaskedEvents,
  (grouping, events) => {
    switch (grouping) {
      case 'Actor':
        return _(events)
          .uniqBy('actor.id')
          .map('actor')
          .value();
      case 'NamedPlace':
        return _(events)
          .uniqBy(e => {
            const localisation = getLocalisation(e);
            return (localisation && localisation.id) || 0;
          })
          .map(e => {
            const localisation = getLocalisation(e);
            return localisation || defaultLocalisation;
          })
          .value();
    }
  }
);

function groupByActor(a: AnyEvent) {
  return a.actor.id;
}

function groupByNamedPlace(a: AnyEvent) {
  const loc = getLocalisation(a);
  return loc ? loc.id : 0;
}

export const selectTimelineGroupBy = createSelector(
  selectTimelineGroup,
  grouping => {
    switch (grouping) {
      case 'Actor':
        return groupByActor;
      case 'NamedPlace':
        return groupByNamedPlace;
    }
  }
);
