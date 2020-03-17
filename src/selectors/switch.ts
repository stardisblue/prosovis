import { RootState } from '../reducers';
import { selectMainColor, selectActorColor } from './color';
import { createSelector } from '@reduxjs/toolkit';
import { PrimaryKey, AnyEvent } from '../data';
import * as d3 from 'd3';

export const selectSwitch = (state: RootState) => state.switch;

export const selectSwitchColor = createSelector(
  selectSwitch,
  selectMainColor,
  selectActorColor,
  (switcher, main, actor) => {
    return (switcher === 'Actor' ? actor : main) as d3.ScaleOrdinal<
      PrimaryKey,
      string
    >;
  }
);

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

export const selectMarkerColor = createSelector(
  selectSwitch,
  selectActorColor,
  selectMainColor,
  (switcher, actor, main) => {
    if (switcher === 'Actor') {
      const border = d3
        .scaleOrdinal<PrimaryKey, string>(
          actor.range().map(d =>
            d3
              .color(d)!
              .darker(2)
              .toString()
          )
        )
        .domain(actor.domain());

      return {
        main: (e: any) => actor(e.actor),
        border: (e: any) => border(e.actor)
      };
    } else {
      const border = d3
        .scaleOrdinal<PrimaryKey, string>(
          main.range().map(d =>
            d3
              .color(d)!
              .darker(2)
              .toString()
          )
        )
        .domain(main.domain());

      return {
        main: (e: any) => main(e.kind),
        border: (e: any) => border(e.kind)
      };
    }
  }
);
export const selectEventColor = createSelector(
  selectSwitch,
  selectActorColor,
  selectMainColor,
  function(switcher, actorColor, mainColor) {
    switch (switcher) {
      case 'Actor': {
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
      }
      case 'Kind':
      default: {
        const border = d3
          .scaleOrdinal<PrimaryKey, string>(
            mainColor.range().map(d =>
              d3
                .color(d)!
                .darker(2)
                .toString()
            )
          )
          .domain(mainColor.domain());
        return {
          main: (e: AnyEvent) => mainColor(e.kind),
          border: (e: AnyEvent) => border(e.kind)
        };
      }
    }
  }
);
