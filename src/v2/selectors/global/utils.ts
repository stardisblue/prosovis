import { reduce } from 'lodash/fp';
import {
  InteractionPayload,
  isEventInteraction,
} from '../../types/interaction';

export function createInteractionMap(state: InteractionPayload[]) {
  return reduce(
    (acc, v) => {
      if (isEventInteraction(v)) {
        acc.events[v.event] = true;
        acc.partActors[v.actor] = true;
      } else {
        acc.actors[v.actor] = true;
      }
      return acc;
    },
    { events: {}, partActors: {}, actors: {} } as {
      events: _.Dictionary<boolean>;
      partActors: _.Dictionary<boolean>;
      actors: _.Dictionary<boolean>;
    },
    state
  );
}
