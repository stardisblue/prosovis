import { RootState } from '../../reducers';
import { createSelector } from 'reselect';
import { reduce } from 'lodash/fp';

export const selectRelationsData = (state: RootState) => state.relationsData;

export const selectRelations = createSelector(
  selectRelationsData,
  (g) => g.relations
);

export const selectRelationsMap = createSelector(
  selectRelations,
  (state) =>
    state &&
    reduce(
      (acc, v) => {
        v.actors.forEach((actor) => {
          if (!acc.has(actor)) acc.set(actor, new Set());
          let neighbours = acc.get(actor)!;

          v.actors.forEach((actee) => {
            if (actee === actor) return;

            neighbours.add(actee);
          });
        });
        return acc;
      },
      new Map<string, Set<string>>(),
      state
    )
);
