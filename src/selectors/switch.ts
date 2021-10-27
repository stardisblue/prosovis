import { createSelector } from '@reduxjs/toolkit';
import * as d3 from 'd3';
import { RootState } from '../reducers';
import {
  selectCustomFilterColor,
  selectDefaultCustomFilter,
  selectDefaultFilterResolver,
} from '../v2/selectors/mask/customFilter';
import { RichEvent } from '../v2/types/events';
import { selectActorColor, selectKindColor } from './color';

export const selectSwitch = (state: RootState) => state.switch;

export const selectSwitchIsActor = createSelector(
  selectSwitch,
  (switcher) => switcher === 'Actor'
);

export const selectMainColor = createSelector(
  selectKindColor,
  selectCustomFilterColor,
  selectDefaultCustomFilter,
  (kind, main, selected) => (selected?.name === 'event.kind' ? kind : main)
);

export const selectSwitchColor = createSelector(
  selectSwitchIsActor,
  selectMainColor,
  selectActorColor,
  (switcher, main, actor) => (switcher ? actor : main)
);

export const selectSwitchKindColor = createSelector(
  selectSwitchIsActor,
  selectKindColor,
  selectDefaultCustomFilter,
  (switcher, kind, selected) =>
    !switcher && selected?.name === 'event.kind' ? kind : null
);

export const selectSwitchMainColor = createSelector(
  selectSwitchIsActor,
  selectMainColor,
  (switcher, main) => (!switcher ? main : undefined)
);

export const selectSwitchActorColor = createSelector(
  selectSwitchIsActor,
  selectActorColor,
  (switcher, actor) => (switcher ? actor : null)
);

export const selectDefaultGroupBy = createSelector(
  selectSwitchIsActor,
  selectDefaultFilterResolver,
  (switcher, path): ((d: RichEvent) => string) =>
    switcher ? ({ actor }) => actor.id : path
);

export const selectRichEventColor = createSelector(
  selectSwitchIsActor,
  selectActorColor,
  selectMainColor,
  selectDefaultFilterResolver,
  function (switcher, actor, main, path) {
    if (switcher) {
      const border = d3
        .scaleOrdinal<string, string>(
          actor.range().map((d) => d3.color(d)!.darker(2).toString())
        )
        .domain(actor.domain());
      return {
        main: (e: RichEvent) => actor(e.actor.id),
        border: (e: RichEvent) => border(e.actor.id),
      };
    } else {
      const border = d3
        .scaleOrdinal<string, string>(
          main.range().map((d) => d3.color(d)!.darker(2).toString())
        )
        .domain(main.domain());
      return {
        main: (e: RichEvent) => main(path(e)),
        border: (e: RichEvent) => border(path(e)),
      };
    }
  }
);
