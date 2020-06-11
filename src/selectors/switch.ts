import { RootState } from '../reducers';
import { selectMainColor, selectActorColor } from './color';
import { createSelector } from '@reduxjs/toolkit';
import { PrimaryKey, AnyEvent } from '../data';
import * as d3 from 'd3';

export const selectSwitch = (state: RootState) => state.switch;

export const selectSwitchIsActor = createSelector(
  selectSwitch,
  (switcher) => switcher === 'Actor'
);
export const selectSwitchColor = createSelector(
  selectSwitchIsActor,
  selectMainColor,
  selectActorColor,
  (switcher, main, actor) => {
    return (switcher ? actor : main) as d3.ScaleOrdinal<PrimaryKey, string>;
  }
);

export const selectSwitchKindColor = createSelector(
  selectSwitchIsActor,
  selectMainColor,
  (switcher, main) => (!switcher ? main : null)
);

export const selectSwitchActorColor = createSelector(
  selectSwitchIsActor,
  selectActorColor,
  (switcher, actor) => (switcher ? actor : null)
);

export const selectMarkerColor = createSelector(
  selectSwitchIsActor,
  selectActorColor,
  selectMainColor,
  (switcher, actor, main) => {
    if (switcher) {
      const border = d3
        .scaleOrdinal<PrimaryKey, string>(
          actor.range().map((d) => d3.color(d)!.darker(2).toString())
        )
        .domain(actor.domain());

      return {
        main: (e: any) => actor(e.actor),
        border: (e: any) => border(e.actor),
      };
    } else {
      const border = d3
        .scaleOrdinal<PrimaryKey, string>(
          main.range().map((d) => d3.color(d)!.darker(2).toString())
        )
        .domain(main.domain());

      return {
        main: (e: any) => main(e.kind),
        border: (e: any) => border(e.kind),
      };
    }
  }
);
export const selectEventColor = createSelector(
  selectSwitchIsActor,
  selectActorColor,
  selectMainColor,
  function (switcher, actorColor, mainColor) {
    switch (switcher) {
      case true: {
        console.log(actorColor.range());

        const border = d3
          .scaleOrdinal<PrimaryKey, string>(
            actorColor.range().map((d) => d3.color(d)!.darker(2).toString())
          )
          .domain(actorColor.domain());
        return {
          main: (e: AnyEvent) => actorColor(e.actor.id),
          border: (e: AnyEvent) => border(e.actor.id),
        };
      }
      case false:
      default: {
        const border = d3
          .scaleOrdinal<PrimaryKey, string>(
            mainColor.range().map((d) => d3.color(d)!.darker(2).toString())
          )
          .domain(mainColor.domain());
        return {
          main: (e: AnyEvent) => mainColor(e.kind),
          border: (e: AnyEvent) => border(e.kind),
        };
      }
    }
  }
);
