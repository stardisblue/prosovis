import { RootState } from '../reducers';
import { selectMainColor, selectActorColor, selectBorderColor } from './color';
import { createSelector } from '@reduxjs/toolkit';
import { PrimaryKey, AnyEvent } from '../data';
import * as d3 from 'd3';

export const selectSwitch = (state: RootState) => state.switch;

export const selectSwitchKindColor = createSelector(
  selectSwitch,
  selectMainColor,
  (switcher, main) => (switcher === 'Kind' ? main : null)
);

export const selectSwitchActorColor = createSelector(
  selectSwitch,
  selectActorColor,
  (switcher, actor) => (switcher === 'Actor' ? actor : null)
);

export const selectEventColor = createSelector(
  selectSwitch,
  selectActorColor,
  selectMainColor,
  selectBorderColor,
  function(switcher, actorColor, mainColor, borderColor) {
    switch (switcher) {
      case 'Actor':
        const border = d3
          .scaleOrdinal<PrimaryKey, string>(
            actorColor.range().map(d =>
              d3
                .color(d)!
                .darker(2)
                .toString()
            )
          )
          .domain(actorColor.domain());

        return {
          main: (e: AnyEvent) => actorColor(e.actor.id),
          border: (e: AnyEvent) => border(e.actor.id)
        };
      case 'Kind':
      default:
        return {
          main: (e: AnyEvent) => mainColor(e.kind),
          border: (e: AnyEvent) => borderColor(e.kind)
        };
    }
  }
);
