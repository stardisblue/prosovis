import { flatMap, flow, keyBy, map, mapValues, pipe } from 'lodash/fp';
import { createSelector } from 'reselect';
import {
  computeEventErrors,
  prepareActorWide,
} from '../../../data/getEventErrors';
import { RootState } from '../../../reducers';
import { ProsoVisActor } from '../../types/actors';
import { ProsoVisDetailRichEvent } from '../../types/events';
import { selectActors } from '../actors';
import { selectRichEvents } from '../events';

export const selectDetailActorIds = (state: RootState) => state.detailActors;
export const selectDetailActors = createSelector(
  selectActors,
  selectDetailActorIds,
  (actors, ids) =>
    actors
      ? flow(
          map((a: string) => actors[a]),
          keyBy<ProsoVisActor>('id')
        )(ids)
      : {}
);

export const selectDetailsRichEvents = createSelector(
  selectDetailActors,
  selectRichEvents,
  (actors, events) =>
    events
      ? flatMap((actor) => {
          const actorEvents = events[actor.id];

          const actorWide = {
            ...prepareActorWide(actorEvents),
            events: actorEvents,
          };

          return actorEvents.map(
            (e) =>
              ({
                ...e,
                actor,
                errors: computeEventErrors(e, actorWide),
              } as ProsoVisDetailRichEvent)
          );
        }, actors)
      : []
);

export const selectDetailKinds = createSelector(
  selectDetailsRichEvents,
  (events) =>
    pipe(
      keyBy('event.kind'),
      mapValues('event.kind')
    )(events) as _.Dictionary<string>
);
