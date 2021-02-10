import { reduce } from 'd3';
import { isEmpty } from 'lodash';
import { createSelector } from 'reselect';
import { selectGlobalSelection } from '../../selectors/global/selection';
import { selectRichEventsFiltered } from '../../selectors/mask';
import { selectRelationsMap } from '../../selectors/relations';

/** fn: active */
export const selectSelectedNeighbours = createSelector(
  selectRelationsMap,
  selectGlobalSelection,
  (relations, selection) =>
    isEmpty(selection)
      ? null
      : selection.reduce(
          (acc, { actor }) => {
            acc.actors[actor] = true;
            const friends = relations?.get(actor)?.values();
            if (friends) {
              reduce(
                friends,
                (acc, friend) => {
                  acc[friend] = true;
                  return acc;
                },
                acc.friends
              );
            }
            return acc;
          },
          { actors: {}, friends: {} } as {
            actors: _.Dictionary<boolean>;
            friends: _.Dictionary<boolean>;
          }
        )
);

export const selectActorsFiltered = createSelector(
  selectRichEventsFiltered,
  (events) =>
    events &&
    reduce(
      events,
      (acc, e) => {
        acc[e.event.actor] = true;
        return acc;
      },
      {} as _.Dictionary<boolean>
    )
);
