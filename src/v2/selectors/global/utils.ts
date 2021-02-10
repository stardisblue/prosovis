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
      } else {
        acc.actors[v.actor] = true;
      }
      return acc;
    },
    { events: {}, actors: {} } as {
      events: { [k: string]: boolean };
      actors: { [k: string]: boolean };
    },
    state
  );
}
