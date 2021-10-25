import { createSelector } from '@reduxjs/toolkit';
import { groupBy, map } from 'lodash/fp';
import { RootState } from '../../reducers';
import { ProsoVisActor } from '../types/actors';
import { ProsoVisEvent, RichEvent } from '../types/events';
import { ProsoVisLocalisation, ProsoVisPlace } from '../types/localisations';
import { selectActors } from './actors';
import { selectLocalisations } from './localisations';

export const selectEvents = (state: RootState) => state.eventData.events;

export const selectRichEvents = createSelector(
  selectEvents,
  selectLocalisations,
  selectActors,
  (events, localisations, actors) =>
    events &&
    localisations &&
    actors &&
    map((e) => localize(localisations, e, actors[e.actor]), events)
);

export const selectEventIndex = createSelector(
  selectRichEvents,
  (events) => events && groupBy('actor.id', events)
);

/**
 * f(x): localize
 */

export function localize(
  localisationsIndex: _.Dictionary<ProsoVisLocalisation> | undefined,
  event: ProsoVisEvent,
  actor: ProsoVisActor
): RichEvent {
  if (localisationsIndex) {
    const localisation =
      event.localisation && localisationsIndex[event.localisation]
        ? localisationsIndex[event.localisation]
        : undefined;

    if (localisation) {
      let place;
      if (localisation.kind === 'Localisation') {
        if (localisation.localisation)
          place = localisationsIndex[
            localisation.localisation
          ] as ProsoVisPlace;
      } else {
        place = localisation;
      }

      return { actor, event, localisation, place };
    }
  }

  return { actor, event };
}
